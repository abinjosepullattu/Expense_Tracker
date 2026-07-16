"""
Report views: monthly summary JSON + PDF/CSV/Excel export endpoints.
All exports are generated synchronously (no Celery needed).
"""
import csv
from datetime import date
from django.http import HttpResponse, FileResponse
from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from transactions.models import Transaction
from .generators.pdf_generator import generate_pdf_report
from .generators.excel_generator import generate_excel_report


def _get_transactions(user, month=None, year=None):
    """Helper — filter transactions for the given user and optional period."""
    qs = Transaction.objects.filter(user=user).select_related('category')
    if month: qs = qs.filter(date__month=int(month))
    if year:  qs = qs.filter(date__year=int(year))
    return qs


class MonthlyReportView(APIView):
    """
    GET /api/reports/monthly?month=7&year=2024
    Returns structured JSON for the Reports page.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        month = request.query_params.get('month', date.today().month)
        year  = request.query_params.get('year',  date.today().year)
        qs    = _get_transactions(request.user, month, year)

        income  = qs.filter(transaction_type='income').aggregate(
            t=Sum('amount'))['t'] or 0
        expense = qs.filter(transaction_type='expense').aggregate(
            t=Sum('amount'))['t'] or 0

        category_breakdown = list(
            qs.filter(transaction_type='expense')
            .values('category__name', 'category__color_hex')
            .annotate(total=Sum('amount'))
            .order_by('-total')
        )

        return Response({
            'month':              int(month),
            'year':               int(year),
            'total_income':       float(income),
            'total_expenses':     float(expense),
            'savings':            float(income) - float(expense),
            'category_breakdown': category_breakdown,
        })


class ExportCSVView(APIView):
    """
    GET /api/reports/export/csv?month=7&year=2024
    Streams a CSV file download.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        month = request.query_params.get('month')
        year  = request.query_params.get('year')
        qs    = _get_transactions(request.user, month, year)

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="transactions.csv"'

        writer = csv.writer(response)
        writer.writerow(['Date', 'Type', 'Category', 'Amount (Rs)', 'Description'])

        for txn in qs.order_by('-date'):
            writer.writerow([
                str(txn.date),
                txn.transaction_type.capitalize(),
                txn.category.name if txn.category else 'N/A',
                float(txn.amount),
                txn.description,
            ])
        return response


class ExportExcelView(APIView):
    """
    GET /api/reports/export/excel?month=7&year=2024
    Streams an .xlsx file download.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        month  = request.query_params.get('month')
        year   = request.query_params.get('year')
        qs     = _get_transactions(request.user, month, year).order_by('-date')
        buffer = generate_excel_report(qs)
        return FileResponse(
            buffer,
            as_attachment=True,
            filename='transactions.xlsx',
            content_type=(
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ),
        )


class ExportPDFView(APIView):
    """
    GET /api/reports/export/pdf?month=7&year=2024
    Streams a PDF file download.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        month = request.query_params.get('month', date.today().month)
        year  = request.query_params.get('year',  date.today().year)
        qs    = _get_transactions(request.user, month, year).order_by('-date')

        income  = qs.filter(transaction_type='income').aggregate(
            t=Sum('amount'))['t'] or 0
        expense = qs.filter(transaction_type='expense').aggregate(
            t=Sum('amount'))['t'] or 0

        summary = {
            'total_income':   income,
            'total_expenses': expense,
            'savings':        float(income) - float(expense),
        }
        buffer = generate_pdf_report(
            request.user, qs, summary, int(month), int(year)
        )
        return FileResponse(
            buffer,
            as_attachment=True,
            filename=f'report_{month}_{year}.pdf',
            content_type='application/pdf',
        )
