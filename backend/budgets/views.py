from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Budget
from .serializers import BudgetSerializer


class BudgetViewSet(viewsets.ModelViewSet):
    """
    CRUD for monthly budgets.
    Supports filtering by ?month=7&year=2024.
    """
    serializer_class   = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs    = Budget.objects.filter(
            user=self.request.user
        ).select_related('category')

        month = self.request.query_params.get('month')
        year  = self.request.query_params.get('year')

        if month: qs = qs.filter(month=month)
        if year:  qs = qs.filter(year=year)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
