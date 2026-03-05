from rest_framework.routers import DefaultRouter
from users.views import UserViewSet
from accounts.views import AccountViewSet
from deposits.views import DepositViewSet
from transactions.views import TransactionViewSet

router = DefaultRouter()

router.register(r'users', UserViewSet)
router.register(r'accounts', AccountViewSet)
router.register(r'deposits', DepositViewSet)
router.register(r'transactions', TransactionViewSet)

urlpatterns = router.urls