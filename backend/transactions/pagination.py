from rest_framework.pagination import PageNumberPagination


class StandardResultsPagination(PageNumberPagination):
    """
    Default pagination: 10 items per page.
    Client may override with ?page_size=N (max 100).
    """
    page_size             = 10
    page_size_query_param = 'page_size'
    max_page_size         = 100
