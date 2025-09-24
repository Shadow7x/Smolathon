from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.decorators import api_view
from core.models.models import  Reports
from core.utils.auth_decor import admin_required
from core.utils.serializers import ReportsSerializer
from django.core.files.base import ContentFile

@api_view(['GET'])
@admin_required
def getReport(request: Request):
    reports = Reports.objects.all()
    serializer = ReportsSerializer(reports, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@admin_required
def createReport(request: Request):
    try:
        data = request.data
        filename = "_".join(data['filename'].split())
        if Reports.objects.filter(file = filename).exists():
            return Response("Такая запись уже существует", status=status.HTTP_400_BAD_REQUEST)
        
        content_file = ContentFile(b"", filename)
        report = Reports(file=content_file)
        report.save()
        return Response("Успешно созданно", status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@admin_required
def deleteReport(request: Request):
    try:
        data = request.data
        report = Reports.objects.get(id=data['id'])
        report.delete()
        return Response("Успешно удалено", status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
