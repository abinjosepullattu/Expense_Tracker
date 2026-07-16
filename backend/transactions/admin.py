from django.contrib import admin
from .models import Transaction, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display  = ['name', 'icon', 'color_hex', 'is_system', 'user']
    list_filter   = ['is_system']
    search_fields = ['name']


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display  = ['user', 'transaction_type', 'category', 'amount', 'date']
    list_filter   = ['transaction_type', 'category']
    search_fields = ['description', 'user__email']
    date_hierarchy = 'date'
