from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.decorators import api_view
from core.utils.parsers.excelParser import ExcelParser
from core.models.models import Detector
from django.db import transaction
from core.utils.auth_decor import admin_required
from core.utils.serializers import DetectorSerializer
import  pandas as pd





@api_view(['POST'])
@admin_required
def createDetectersFromExcel(request: Request) -> Response:
    if request.FILES.get('file'):
        try:
            file = request.FILES['file']
            file.name = "_".join(file.name.split())
           
            try:
                towTruck = ExcelParser(file).df
                if list(towTruck.columns) != ['Name ', 'Latitude', 'Longitude']:
                    print(list(towTruck.columns))
                    return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)

               
                Detector.objects.all().delete()
                objs = []
                for row in towTruck.itertuples(index=False, name=None):
                    objs.append(Detector(
                        name = row[0],
                        latitude = row[1],
                        longitude = row[2]
                    ))
                with transaction.atomic():
                    Detector.objects.bulk_create(objs, batch_size=1000)

                return Response("Отчет успешно создался", status=status.HTTP_201_CREATED)
                
            except Exception as e:
                print(e)
                
                return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
    return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@admin_required
def getDetectors(request: Request):
    towTruck = Detector.objects.all()
    serializer = DetectorSerializer(towTruck, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


