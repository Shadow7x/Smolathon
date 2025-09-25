from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.decorators import api_view
from core.models.models import News
from django.db import transaction
from core.utils.auth_decor import token_required
from core.utils.serializers import DTPSerializer


@api_view(['GET'])
def getNews(request: Request):
    news = DTP.objects.all()
    if request.GET.get("id"):
        news = news.filter(id=request.GET.get("id"))
    serializer = DTPSerializer(news, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@token_required
def createNews(request: Request):
    data = request.data
    try:
        title = data.get('title')
        text = data.get('text')
        if request.FILES.get('image'):
            image = request.FILES.get('image')
            if image.name.endswith('.png') or image.name.endswith('.jpg') or image.name.endswith('.jpeg'):
                image = image
            else:
                return Response('Неверный формат файла', status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response('Неверный формат файла', status=status.HTTP_400_BAD_REQUEST)
        
        News.objects.create(title=title, text=text, image=image)
        return Response('Новость успешно создана', status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response( 'Новость не создана', status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
@token_required
def deleteNews(request: Request):
    try:
        data = request.data
        news = News.objects.get(id=data['id'])
        news.delete()
        return Response("Успешно удалено", status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@token_required
def updateNews(request: Request):
    try:
        data = request.data
        news = News.objects.get(id=data['id'])
        news.title = data.get('title', news.title)
        news.text = data.get('text', news.text)
        if request.FILES.get('image'):
            img = request.FILES.get('image')
            if img.name.endswith('.png') or img.name.endswith('.jpg') or img.name.endswith('.jpeg'):
                news.image.delete()
                news.image = img
            
            else:
                return Response('Неверный формат файла', status=status.HTTP_400_BAD_REQUEST)
            
        news.save()
        return Response("Успешно обновленно", status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
