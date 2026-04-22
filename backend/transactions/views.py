from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from .models import Transaction
from .serializers import TransactionSerializer
from accounts.models import Account
from users.models import User
from decimal import Decimal
from django.utils import timezone
import calendar
from django.db.models import Sum ,Q
from django.http import HttpResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from io import BytesIO
import os


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_accounts = self.request.user.accounts.values_list('id', flat=True)
        return Transaction.objects.filter(
            Q(from_account__in=user_accounts) | Q(to_account__in=user_accounts)
        ).order_by('-created_at')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def make_transfer(request):
    data = request.data
    amount = data.get('amount')
    mode = data.get('mode')
    recipient = data.get('recipient')

    if not all([amount, mode, recipient]):
        return Response(
            {'error': 'Заполните все поля'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        amount = float(amount)
        if amount <= 0:
            raise ValueError
    except ValueError:
        return Response(
            {'error': 'Введите корректную сумму'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        from_account = Account.objects.get(user=request.user)
    except Account.DoesNotExist:
        return Response(
            {'error': 'У вас нет счёта'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if from_account.balance < amount:
        return Response(
            {'error': 'Недостаточно средств'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        if mode == 'phone':
            recipient_user = User.objects.get(phone=recipient)
        else:
            recipient_user = User.objects.get(card_number=recipient)
    except User.DoesNotExist:
        return Response(
            {'error': 'Получатель не найден'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if recipient_user == request.user:
        return Response(
            {'error': 'Нельзя переводить самому себе'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        to_account = Account.objects.get(user=recipient_user)
    except Account.DoesNotExist:
        return Response(
            {'error': 'У получателя нет счёта'},
            status=status.HTTP_400_BAD_REQUEST
        )

    from_account.balance -= Decimal(str(amount))
    to_account.balance += Decimal(str(amount))
    from_account.save()
    to_account.save()

    transaction = Transaction.objects.create(
        from_account=from_account,
        to_account=to_account,
        amount=amount,
        type='transfer',
        category='other'
    )

    return Response(
        {'message': f'Перевод на сумму {amount} ₽ выполнен успешно'},
        status=status.HTTP_201_CREATED
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics_by_week(request):
    now = timezone.now()
    user_accounts = request.user.accounts.values_list('id', flat=True)

    first_day = now.replace(day=1, hour=0, minute=0, second=0)
    last_day = now.replace(day=calendar.monthrange(now.year, now.month)[1], hour=23, minute=59, second=59)

    weeks = [
        (first_day, first_day.replace(day=7)),
        (first_day.replace(day=8), first_day.replace(day=14)),
        (first_day.replace(day=15), first_day.replace(day=21)),
        (first_day.replace(day=22), last_day),
    ]

    expenses = []
    incomes = []

    for start, end in weeks:
        exp = Transaction.objects.filter(
            from_account__in=user_accounts,
            type__in=['withdrawal', 'transfer'],
            created_at__range=(start, end),
        ).aggregate(total=Sum('amount'))['total'] or 0

        inc = Transaction.objects.filter(
            to_account__in=user_accounts,
            type__in=['deposit', 'transfer'],
            created_at__range=(start, end),
        ).aggregate(total=Sum('amount'))['total'] or 0

        expenses.append(float(exp))
        incomes.append(float(inc))

    return Response({
        'labels': ['1 нед', '2 нед', '3 нед', '4 нед'],
        'expenses': expenses,
        'incomes': incomes,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics_by_category(request):
    user_accounts = request.user.accounts.values_list('id', flat=True)
    
    now = timezone.now()
    first_day = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    categories = ['food', 'transport', 'entertainment', 'subscriptions', 'other']
    labels = ['Еда', 'Транспорт', 'Развлечения', 'Подписки', 'Другое']
    data = []

    for cat in categories:
        total = Transaction.objects.filter(
            from_account__in=user_accounts,
            type__in=['withdrawal', 'transfer'],
            category=cat,
            created_at__gte=first_day 
        ).aggregate(total=Sum('amount'))['total'] or 0
        data.append(float(total))

    return Response({
        'labels': labels,
        'data': data,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_report(request):
    user = request.user
    user_accounts = user.accounts.values_list('id', flat=True)

    # Берём транзакции за текущий месяц
    now = timezone.now()
    first_day = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    transactions = Transaction.objects.filter(
        Q(from_account__in=user_accounts) | Q(to_account__in=user_accounts),
        created_at__gte=first_day
    ).order_by('-created_at')

    # Считаем итоги
    total_income = transactions.filter(
        to_account__in=user_accounts,
        type__in=['deposit', 'transfer']
    ).aggregate(total=Sum('amount'))['total'] or 0

    total_expenses = transactions.filter(
        from_account__in=user_accounts,
        type__in=['withdrawal', 'transfer']
    ).aggregate(total=Sum('amount'))['total'] or 0

    # Создаём PDF в памяти
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = []

    # Подключаем шрифт с поддержкой кириллицы
    font_path = os.path.join(os.path.dirname(__file__), 'DejaVuLGCSans.ttf')
    pdfmetrics.registerFont(TTFont('DejaVu', font_path))

    title_style = styles['Title']
    title_style.fontName = 'DejaVu'

    normal_style = styles['Normal']
    normal_style.fontName = 'DejaVu'

    # Заголовок
    elements.append(Paragraph(f'Финансовый отчёт', title_style))
    elements.append(Paragraph(f'Клиент: {user.name}', normal_style))
    elements.append(Paragraph(f'Период: {first_day.strftime("%d.%m.%Y")} — {now.strftime("%d.%m.%Y")}', normal_style))
    elements.append(Spacer(1, 20))

    # Итоги
    elements.append(Paragraph(f'Доходы за месяц: {total_income} ₽', normal_style))
    elements.append(Paragraph(f'Расходы за месяц: {total_expenses} ₽', normal_style))
    elements.append(Spacer(1, 20))

    # Таблица транзакций
    elements.append(Paragraph('Операции за месяц:', normal_style))
    elements.append(Spacer(1, 10))

    # Заголовки таблицы
    table_data = [['Дата', 'Тип', 'Категория', 'Сумма']]

    type_labels = {'transfer': 'Перевод', 'deposit': 'Пополнение', 'withdrawal': 'Снятие'}
    category_labels = {'food': 'Еда', 'transport': 'Транспорт', 'entertainment': 'Развлечения', 'subscriptions': 'Подписки', 'other': 'Другое'}

    for t in transactions:
        table_data.append([
            t.created_at.strftime('%d.%m.%Y %H:%M'),
            type_labels.get(t.type, t.type),
            category_labels.get(t.category, t.category),
            f'{t.amount} ₽',
        ])

    if len(table_data) > 1:
        table = Table(table_data, colWidths=[120, 100, 120, 100])
        table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (-1, -1), 'DejaVu'),
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey]),
        ]))
        elements.append(table)
    else:
        elements.append(Paragraph('Операций за этот месяц нет', normal_style))

    doc.build(elements)
    buffer.seek(0)

    # Отдаём файл на скачивание
    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="report_{now.strftime("%Y_%m")}.pdf"'
    return response