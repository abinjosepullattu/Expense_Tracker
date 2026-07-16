from rest_framework import serializers
from django.db.models import Sum
from .models import Budget
from transactions.models import Transaction
from transactions.serializers import CategorySerializer


class BudgetSerializer(serializers.ModelSerializer):
    # Nested read-only category detail
    category_detail = CategorySerializer(source='category', read_only=True)

    # Computed fields — calculated from actual transaction data
    spent           = serializers.SerializerMethodField()
    remaining       = serializers.SerializerMethodField()
    status          = serializers.SerializerMethodField()
    utilization_pct = serializers.SerializerMethodField()

    class Meta:
        model  = Budget
        fields = [
            'id', 'category', 'category_detail',
            'amount', 'month', 'year',
            'spent', 'remaining', 'status', 'utilization_pct',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    # ── Helpers ─────────────────────────────────────────────────────────────

    def _spent_amount(self, obj):
        """Sum of expense transactions for this user/category/month/year."""
        result = Transaction.objects.filter(
            user=obj.user,
            category=obj.category,
            transaction_type='expense',
            date__month=obj.month,
            date__year=obj.year,
        ).aggregate(total=Sum('amount'))
        return float(result['total'] or 0)

    # ── SerializerMethodFields ───────────────────────────────────────────────

    def get_spent(self, obj):
        return self._spent_amount(obj)

    def get_remaining(self, obj):
        return float(obj.amount) - self._spent_amount(obj)

    def get_status(self, obj):
        if not obj.amount:
            return 'Safe'
        ratio = self._spent_amount(obj) / float(obj.amount)
        if ratio >= 1.0:
            return 'Over Budget'
        elif ratio >= 0.85:
            return 'Warning'
        return 'Safe'

    def get_utilization_pct(self, obj):
        if not obj.amount:
            return 0
        return round((self._spent_amount(obj) / float(obj.amount)) * 100, 2)

    # ── Write ────────────────────────────────────────────────────────────────

    def validate_month(self, value):
        if not 1 <= value <= 12:
            raise serializers.ValidationError('Month must be between 1 and 12.')
        return value

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Budget amount must be greater than zero.')
        return value

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
