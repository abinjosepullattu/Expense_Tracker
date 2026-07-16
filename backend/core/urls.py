"""
URL configuration for the Personal Finance Tracker API.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/',            admin.site.urls),
    # Auth
    path('api/auth/',         include('accounts.urls')),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    # Core features
    path('api/',              include('transactions.urls')),
    path('api/',              include('budgets.urls')),
    path('api/reports/',      include('reports.urls')),
]
