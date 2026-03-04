from django.db import models

class Deposit(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='deposits')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    duration = models.IntegerField()  # в месяцах
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)