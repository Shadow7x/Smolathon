from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from core.models.models import authorizedToken

@api_view(['POST'])
def login(request: Request):
    if request.POST.get("login") and request.POST.get("password"):
        try:
            user= authenticate(name = request.POST.get("login"), password = request.POST.get("password"))
            if user:
                token = authorizedToken.objects.get_or_create(user = user)[0].token()
                return Response({"token":token},status=status.HTTP_200_OK)
        except:
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