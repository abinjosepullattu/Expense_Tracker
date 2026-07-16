from django.db import models
from django.conf import settings


class Category(models.Model):
    """
    Spend/income category — either a system default or user-created.
    System categories are auto-created on user registration via signal.
    """
    name      = models.CharField(max_length=100)
    icon      = models.CharField(max_length=50, blank=True, default='📦')
    color_hex = models.CharField(max_length=7, default='#6366f1')
    is_system = models.BooleanField(default=False)
    user      = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name='categories',
    )

    class Meta:
        verbose_name_plural = 'Categories'
        ordering            = ['name']

    def __str__(self):
        return self.name


class Transaction(models.Model):
    """
    A single financial event — either income or expense.
    Belongs to one user and optionally one category.
    """
    INCOME  = 'income'
    EXPENSE = 'expense'
    TYPE_CHOICES = [
        (INCOME,  'Income'),
        (EXPENSE, 'Expense'),
    ]

    user             = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='transactions',
    )
    transaction_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    category         = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='transactions',
    )
    amount      = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True)
    date        = models.DateField()
    is_bill     = models.BooleanField(default=False)
    bill_due_date = models.DateField(null=True, blank=True)
    bill_image    = models.TextField(null=True, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']
        indexes  = [
            models.Index(fields=['user', 'date']),
            models.Index(fields=['user', 'transaction_type']),
            models.Index(fields=['user', 'category']),
        ]

    def __str__(self):
        return f"{self.transaction_type} | {self.amount} | {self.date}"
