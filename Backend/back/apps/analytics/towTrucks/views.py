from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.decorators import api_view
from core.utils.parsers.excelParser import ExcelParser
from core.models.models import TowTrucks, Reports
from django.db import transaction
from core.utils.auth_decor import token_required
from core.utils.serializers import TowTrucksSerializer
import  pandas as pd





@api_view(['POST'])
@token_required
def createTowTruck(request: Request) -> Response:
    if request.FILES.get('file'):
        try:
            file = request.FILES['file']
            file.name = "_".join(file.name.split())
            if Reports.objects.filter(file=file.name).exists():
                return Response("Такой отчет уже существует", status=status.HTTP_400_BAD_REQUEST)
            report = Reports.objects.create(file=file)
            try:
                towTruck = ExcelParser(file).df
                if list(towTruck.columns) != ['Дата',
                                                'Количество эвакуаторов на линии',
                                                'Количество выездов',
                                                'Количество эвакуаций',
                                                'Сумма поступлений по  штрафстоянке']:
                    report.delete()
                    return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
                towTruck.columns =[
                            'date',
                            'tow_truck_in_line',
                            'count_departures',
                            'count_evacuations',
                            'summary_of_parking_lot'
                ]
                towTruck['date'] = pd.to_datetime(towTruck['date'])
                
                towTruck = towTruck.sort_values('date').reset_index(drop=True)
                objs = []
                for row in towTruck.itertuples(index=False, name=None):
                    objs.append(TowTrucks(
                        date=row[0],
                        tow_truck_in_line=row[1],
                        count_departures=row[2],
                        count_evacuations=row[3],
                        summary_of_parking_lot=row[4],
                        report=report
                    ))
                with transaction.atomic():
                    TowTrucks.objects.bulk_create(objs, batch_size=1000)

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
def getTowTruck(request: Request):
    towTruck = TowTrucks.objects.all()
    try:
        if request.GET.get('date'):
            towTruck = towTruck.filter(date=request.GET.get('date'))
        if request.GET.get('date_from') and request.GET.get('date_to'):
            towTruck = towTruck.filter(date__range=[request.GET.get('date_from'), request.GET.get('date_to')])
        if request.GET.get("year"):
            towTruck = towTruck.filter(date__year=request.GET.get("year"))
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
    serializer = TowTrucksSerializer(towTruck, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
