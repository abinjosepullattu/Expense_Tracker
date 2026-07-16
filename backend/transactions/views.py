import datetime
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum
from django.db.models.functions import TruncMonth

from .models import Transaction, Category
from .serializers import TransactionSerializer, CategorySerializer
from .filters import TransactionFilter
from .pagination import StandardResultsPagination


class CategoryViewSet(viewsets.ModelViewSet):
    """CRUD for categories. Users only see their own categories."""
    serializer_class   = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TransactionViewSet(viewsets.ModelViewSet):
    """
    Full CRUD for transactions.
    Supports filtering, searching, ordering and pagination.
    Extra actions:
      - summary()       → totals for dashboard cards
      - monthly_trend() → last 6 months data for charts
    """
    serializer_class   = TransactionSerializer
    permission_classes = [IsAuthenticated]
    pagination_class   = StandardResultsPagination
    filter_backends    = [DjangoFilterBackend,
                          filters.SearchFilter,
                          filters.OrderingFilter]
    filterset_class    = TransactionFilter
    search_fields      = ['description', 'category__name']
    ordering_fields    = ['date', 'amount', 'created_at']
    ordering           = ['-date']

    def get_queryset(self):
        """Always filter by the logged-in user — no cross-user access."""
        return Transaction.objects.filter(
            user=self.request.user
        ).select_related('category')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # ── Custom actions ──────────────────────────────────────────────────────

    @action(detail=False, methods=['get'], url_path='summary')
    def summary(self, request):
        """
        GET /api/transactions/summary/
        Returns total income, total expenses and net savings.
        Used by the dashboard summary cards.
        """
        qs = self.get_queryset()
        income  = qs.filter(transaction_type='income').aggregate(
            total=Sum('amount'))['total'] or 0
        expense = qs.filter(transaction_type='expense').aggregate(
            total=Sum('amount'))['total'] or 0
        return Response({
            'total_income':   float(income),
            'total_expenses': float(expense),
            'savings':        float(income) - float(expense),
        })

    @action(detail=False, methods=['get'], url_path='monthly-trend')
    def monthly_trend(self, request):
        """
        GET /api/transactions/monthly-trend/
        Returns income vs expense aggregated by month for last 6 months.
        Used by the Line/Bar chart on the dashboard.
        """
        today          = datetime.date.today()
        six_months_ago = (today.replace(day=1) - datetime.timedelta(days=180))

        data = (
            self.get_queryset()
            .filter(date__gte=six_months_ago)
            .annotate(month=TruncMonth('date'))
            .values('month', 'transaction_type')
            .annotate(total=Sum('amount'))
            .order_by('month')
        )
        return Response(list(data))
