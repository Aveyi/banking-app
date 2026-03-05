from django.db import models

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('transfer', 'Transfer'),
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
    ]

    from_account = models.ForeignKey('accounts.Account', null=True, blank=True, on_delete=models.CASCADE, related_name='outgoing_transactions')
    to_account = models.ForeignKey('accounts.Account', null=True, blank=True, on_delete=models.CASCADE, related_name='incoming_transactions')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)