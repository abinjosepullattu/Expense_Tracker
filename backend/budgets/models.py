from django.db import models
from django.conf import settings
from transactions.models import Category


class Budget(models.Model):
    """
    Monthly budget for a specific category.
    Spending vs budget is computed at query time via the serializer.
    Unique constraint: one budget per (user, category, month, year).
    """
    user     = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='budgets',
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='budgets',
    )
    amount     = models.DecimalField(max_digits=12, decimal_places=2)
    month      = models.PositiveSmallIntegerField(help_text='1–12')
    year       = models.PositiveSmallIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'category', 'month', 'year')
        indexes = [
            models.Index(fields=['user', 'year', 'month']),
        ]
        ordering = ['-year', '-month']

    def __str__(self):
        return f"{self.user.email} | {self.category} | {self.month}/{self.year}"
