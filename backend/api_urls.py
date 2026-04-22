from django.urls import path
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet, RegisterView, current_user
from accounts.views import AccountViewSet
from deposits.views import DepositViewSet
from transactions.views import TransactionViewSet, make_transfer, analytics_by_category, analytics_by_week, download_report

router = DefaultRouter()

router.register(r'users', UserViewSet)
router.register(r'accounts', AccountViewSet, basename='accounts')
router.register(r'deposits', DepositViewSet, basename='deposits')
router.register(r'transactions', TransactionViewSet, basename='transactions')

urlpatterns =  [ path('users/me/', current_user, name='current_user'),
] + router.urls + [
    path('register/', RegisterView.as_view(), name='register'),
    path('users/me', current_user, name='current_user'),
    path('transfer/', make_transfer, name='make_transfer'),
    path('analytics/weekly/', analytics_by_week, name='analytics_by_week'),
    path('analytics/categories/', analytics_by_category, name="analytics_by_category"),
    path('report/', download_report, name='download_report'),
]