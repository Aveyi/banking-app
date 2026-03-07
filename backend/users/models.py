from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self, email, password, name, phone):
        user = self.model(
            email = self.normalize_email(email),
            name = name,
            phone = phone,
        )
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, name='Admin', phone=''):
        user = self.create_user(email, password, name, phone)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return user

class User(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
