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