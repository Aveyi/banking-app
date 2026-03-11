from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from .models import Deposit
from .serializers import DepositSerializer
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from decimal import Decimal
from accounts.models import Account
from transactions.models import Transaction

class DepositViewSet(viewsets.ModelViewSet):
    serializer_class = DepositSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Deposit.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        amount = serializer.validated_data['amount']

        try:
            account = Account.objects.get(user=self.request.user)
        except Account.DoesNotExist:
            raise ValidationError('У вас нет счёта')

        if account.balance < amount:
            raise ValidationError('Недостаточно средств')

        account.balance -= Decimal(str(amount))
        account.save()

        serializer.save(user=self.request.user)

        Transaction.objects.create(
        from_account=account,
        to_account=None,
        amount=amount,
        type='withdrawal',
        category='other'
    )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            self.perform_create(serializer)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.data, status=status.HTTP_201_CREATED)