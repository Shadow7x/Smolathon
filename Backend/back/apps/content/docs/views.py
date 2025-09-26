from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.decorators import api_view
from core.models.models import Docs
from core.utils.auth_decor import token_required
from core.utils.serializers import DocsSerializer
from django.http import FileResponse, Http404
from django.conf import settings
import os


@api_view(['GET'])
def getDocs(request: Request):
    news = Docs.objects.all()
    if request.GET.get("id"):
        news = news.filter(id=request.GET.get("id")).first()
        
        file_path = os.path.join(settings.MEDIA_ROOT, news.file.name)
        if not os.path.exists(file_path):
            raise Http404("Файл не найден")

        response = FileResponse(open(file_path, 'rb'))
        response['Content-Disposition'] = f'attachment; filename="{news.file.name}"'
        return response
            
    serializer = DocsSerializer(news, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@token_required
def createDocs(request: Request):
    try:
        if request.FILES.get('file'):
            file = request.FILES.get('file')
        else:
            return Response('Не выбран файл', status=status.HTTP_400_BAD_REQUEST)
        
        
        Docs.objects.create(file=file)
        return Response('Документ загружен', status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response( 'Документ не загружен', status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
@token_required
def deleteDocs(request: Request):
    try:
        data = request.data
        news = Docs.objects.get(id=data['id'])
        news.delete()
        return Response("Успешно удалено", status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@token_required
def updateDocs(request: Request):
    try:
        if request.FILES.get('file'):
            file = request.FILES.get('file')
        else:
            return Response('Не выбран файл', status=status.HTTP_400_BAD_REQUEST)
        
        data = request.data
        docs = Docs.objects.get(id=data['id'])
        docs.file.delete()
        docs.file = file
        docs.save()
        
        return Response("Успешно обновленно", status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)

