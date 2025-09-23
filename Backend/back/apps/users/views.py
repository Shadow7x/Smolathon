from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from core.models.models import authorizedToken
from core.utils.auth_decor import token_required
from core.utils.serializers import UserSerializer

@api_view(['POST'])
def login(request: Request):
    if request.POST.get("login") and request.POST.get("password"):
        try:
            user= authenticate(username = request.POST.get("login"), password = request.POST.get("password"))
            print(f"{user = }, {request.POST.get('login') = }, {request.POST.get('password') = }")
            if user:
                token = authorizedToken.objects.get_or_create(user = user)[0].token()
                return Response({"token":token},status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response("Неправильное имя пользователя или пароль",status=status.HTTP_400_BAD_REQUEST)
    return Response("Неправильное имя пользователя или пароль",status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def logout(request: Request):
    if request.headers.get("Authorization"):
        try:
            auth_header = request.headers.get("Authorization")
            token = auth_header.split(" ")[1]
            authorizedToken.objects.get(key=token).delete()
            return Response("Вышли из аккаунта",status=status.HTTP_200_OK)
        except:
            return Response('Не удалось выйти из аккаунта',status=status.HTTP_406_NOT_ACCEPTABLE)
    return Response('Необходимо авторизоваться',status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@token_required
def info(request: Request):
    user = request.user
    try:
        data= UserSerializer(user).data
        return Response(data, status=status.HTTP_200_OK)
        
    except :
        return Response({'message': 'Профиль не обнаружен'}, status=status.HTTP_404_NOT_FOUND)
