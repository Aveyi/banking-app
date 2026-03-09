from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Transaction
from .serializers import TransactionSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # транзакция принадлежит пользователю если его счёт фигурирует как отправитель ИЛИ получатель
        user_accounts = self.request.user.accounts.values_list('id', flat=True)
        return Transaction.objects.filter(
            Q(from_account__in=user_accounts) | Q(to_account__in=user_accounts)
        ).order_by('-created_at')