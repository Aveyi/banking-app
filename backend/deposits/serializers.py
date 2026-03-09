from rest_framework import serializers
from .models import Deposit

class DepositSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deposit
        fields = '__all__'
        read_only_fields = ['user', 'created_at']