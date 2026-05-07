from rest_framework import viewsets
from .models import User
from .serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        password = data.get('password', '')

        if not all([name, email, phone, password]):
            return Response(
                {'error': "Все поля обязательны"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': "Пользователь с таким email уже существует"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        User.objects.create_user(
            email=email,
            password=password,
            name=name,
            phone=phone,
        )
        return Response(
            {'succes': "Пользователь успешно создан"},
            status=status.HTTP_201_CREATED
        )
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    return Response({
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'joined': user.created_at.strftime('%B %Y'),
    })

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user(request):
    user = request.user
    data = request.data

    email = data.get('email', '').strip()
    phone = data.get('phone', '').strip()

    if not email and not phone:
        return Response(
            {'error': 'Укажите хотя бы одно поле для изменения'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Проверяем что новый email не занят другим пользователем
    if email and email != user.email:
        if User.objects.filter(email=email).exclude(pk=user.pk).exists():
            return Response(
                {'error': 'Этот email уже используется'},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.email = email

    if phone:
        user.phone = phone

    user.save()

    return Response({
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
    })