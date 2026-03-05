from django.db import models
from decimal import Decimal

class Account(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='accounts')
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)