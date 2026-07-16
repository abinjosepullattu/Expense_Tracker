from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from transactions.models import Category


DEFAULT_CATEGORIES = [
    {'name': 'Food & Dining',  'icon': '🍽️', 'color_hex': '#f59e0b'},
    {'name': 'Transportation', 'icon': '🚗', 'color_hex': '#3b82f6'},
    {'name': 'Shopping',       'icon': '🛍️', 'color_hex': '#ec4899'},
    {'name': 'Entertainment',  'icon': '🎬', 'color_hex': '#8b5cf6'},
    {'name': 'Healthcare',     'icon': '🏥', 'color_hex': '#10b981'},
    {'name': 'Utilities',      'icon': '💡', 'color_hex': '#6366f1'},
    {'name': 'Salary',         'icon': '💼', 'color_hex': '#22c55e'},
    {'name': 'Freelance',      'icon': '💻', 'color_hex': '#0ea5e9'},
    {'name': 'Investment',     'icon': '📈', 'color_hex': '#f97316'},
    {'name': 'Other',          'icon': '📦', 'color_hex': '#64748b'},
]


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_default_categories(sender, instance, created, **kwargs):
    """
    Auto-create a set of default spend/income categories
    for every new user upon registration.
    """
    if created:
        Category.objects.bulk_create([
            Category(user=instance, is_system=True, **cat)
            for cat in DEFAULT_CATEGORIES
        ])
