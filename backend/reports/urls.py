from django.urls import path
from . import views

urlpatterns = [
    path('monthly',      views.MonthlyReportView.as_view(), name='monthly-report'),
    path('export/pdf',   views.ExportPDFView.as_view(),     name='export-pdf'),
    path('export/csv',   views.ExportCSVView.as_view(),     name='export-csv'),
    path('export/excel', views.ExportExcelView.as_view(),   name='export-excel'),
]
