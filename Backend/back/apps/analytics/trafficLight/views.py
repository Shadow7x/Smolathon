from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.decorators import api_view
from core.utils.parsers.excelParser import ExcelParser
from core.models.models import TrafficLight, Reports
from django.db import transaction
from core.utils.auth_decor import token_required,admin_required
from core.utils.serializers import TrafficLightSerializer
import  pandas as pd





@api_view(['POST'])
@admin_required
def createTrafficLightFromExcel(request: Request) -> Response:
    if request.FILES.get('file'):
        try:
            file = request.FILES['file']
            file.name = "_".join(file.name.split())
            if Reports.objects.filter(file=file.name).exists():
                return Response("Такой отчет уже существует", status=status.HTTP_400_BAD_REQUEST)
            report = Reports.objects.create(file=file)
            try:
                trafficLight = ExcelParser(file).df
                if list(trafficLight.columns) != ['№ П/П',
                                                'адрес',
                                                'тип светофора',
                                                'год установки']:
                    report.delete()
                    return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
                trafficLight.columns =[
                                "numPP",
                                "address",
                                "type",
                                "year"
                ]
                
                trafficLight = trafficLight.sort_values('numPP').reset_index(drop=True)
                objs = []
                for row in trafficLight.itertuples(index=False, name=None):
                    objs.append(TrafficLight(
                        numPP=row[0],
                        address=row[1], 
                        type=row[2],
                        year=row[3],
                        report=report
                    ))
                with transaction.atomic():
                    TrafficLight.objects.bulk_create(objs, batch_size=1000)

                return Response("Отчет успешно создался", status=status.HTTP_201_CREATED)
                
            except Exception as e:
                print(e)
                
                report.delete()
                return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
    return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@admin_required
def getTrafficLight(request: Request):
    trafficLight = TrafficLight.objects.all()
    try:
        
        if request.GET.get("year"):
            trafficLight = trafficLight.filter(date__year=request.GET.get("year"))
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
    serializer = TrafficLightSerializer(trafficLight, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@admin_required
def createTrafficLight(request: Request):
    try:
        data = request.data
        report = Reports.objects.get(id=data['report'])
        if TrafficLight.objects.filter(numPP=data['numPP']).exists():
            return Response("Такая запись уже существует", status=status.HTTP_400_BAD_REQUEST)
        TrafficLight.objects.create(numPP=data['numPP'], address=data['address'], type=data['type'], year=data['year'], report=report)

        return Response("Успешно созданно", status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
@admin_required
def updateTrafficLight(request: Request):
    try:
        data = request.data
        trafficLight = TrafficLight.objects.get(id=data['id'])
        trafficLight.address = data['address']
        trafficLight.type = data['type']
        trafficLight.year = data['year']
        trafficLight.save()
        return Response("Успешно обновленно", status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@admin_required
def deleteTrafficLight(request: Request):
    try:
        data = request.data
        penalties = TrafficLight.objects.get(id=data['id'])
        penalties.delete()
        return Response("Успешно удалено", status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)