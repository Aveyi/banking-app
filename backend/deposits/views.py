from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Deposit
from .serializers import DepositSerializer

class DepositViewSet(viewsets.ModelViewSet):
    serializer_class = DepositSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Deposit.objects.filter(user=self.request.user)