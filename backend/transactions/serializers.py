from rest_framework import serializers
from .models import Transaction, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Category
        fields = ['id', 'name', 'icon', 'color_hex', 'is_system']


class TransactionSerializer(serializers.ModelSerializer):
    # Read-only nested detail — returned in responses
    category_detail = CategorySerializer(source='category', read_only=True)

    class Meta:
        model  = Transaction
        fields = [
            'id', 'transaction_type',
            'category', 'category_detail',
            'amount', 'description', 'date',
            'is_bill', 'bill_due_date', 'bill_image',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'category_detail']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Amount must be greater than zero.')
        return value

    def validate_category(self, value):
        """Ensure the category belongs to the requesting user."""
        if value and value.user != self.context['request'].user:
            raise serializers.ValidationError('Invalid category.')
        return value

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
