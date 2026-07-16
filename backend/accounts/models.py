from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    """
    Extended user model.
    Uses EMAIL as the primary login field instead of username.
    """
    email      = models.EmailField(unique=True)
    phone      = models.CharField(max_length=20, blank=True)
    currency   = models.CharField(max_length=10, default='INR',
                                  help_text='Preferred currency code, e.g. INR, USD')
    updated_at = models.DateTimeField(auto_now=True)

    # Use email as the login credential
    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        db_table     = 'accounts_user'
        verbose_name = 'User'

    def __str__(self):
        return self.email

    def get_full_name(self):
        full = f"{self.first_name} {self.last_name}".strip()
        return full or self.username
