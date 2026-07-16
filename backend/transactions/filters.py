import django_filters
from .models import Transaction


class TransactionFilter(django_filters.FilterSet):
    """
    Filtering support for the transaction list endpoint.
    Usage: ?transaction_type=expense&date_from=2024-07-01&date_to=2024-07-31
           &category=3&min_amount=100&max_amount=5000
    """
    date_from  = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    date_to    = django_filters.DateFilter(field_name='date', lookup_expr='lte')
    min_amount = django_filters.NumberFilter(field_name='amount', lookup_expr='gte')
    max_amount = django_filters.NumberFilter(field_name='amount', lookup_expr='lte')

    class Meta:
        model  = Transaction
        fields = [
            'transaction_type',
            'category',
            'date_from',
            'date_to',
            'min_amount',
            'max_amount',
        ]
