from django.contrib import admin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display  = ['email', 'username', 'first_name', 'last_name', 'currency', 'is_active']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    list_filter   = ['is_active', 'is_staff', 'currency']
