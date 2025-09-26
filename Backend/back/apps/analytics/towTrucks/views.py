from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.decorators import api_view
from core.utils.parsers.excelParser import ExcelParser
from core.models.models import TowTrucks, Reports
from django.db import transaction
from core.utils.auth_decor import admin_required
from core.utils.serializers import TowTrucksSerializer
import  pandas as pd





@api_view(['POST'])
@admin_required
def createTowTruckFromExcel(request: Request) -> Response:
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
@admin_required
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


@api_view(['POST'])
@admin_required
def createTowTruck(request: Request):
    try:
        data = request.data
        report = Reports.objects.get(id=data['report'])
        if TowTrucks.objects.filter(date = data['date']).exists():
            return Response("Такая запись уже существует", status=status.HTTP_400_BAD_REQUEST)
        TowTrucks.objects.create(
            date = data['date'],
            tow_truck_in_line = data['tow_truck_in_line'],
            count_departures = data['count_departures'],
            count_evacuations = data['count_evacuations'],
            summary_of_parking_lot = data['summary_of_parking_lot'],
            report = report
        )

        return Response("Успешно созданно", status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
@admin_required
def updateTowTruck(request: Request):
    try:
        data = request.data
        towTruck = TowTrucks.objects.get(id=data['id'])
        towTruck.tow_truck_in_line = data['tow_truck_in_line']
        towTruck.count_departures = data['count_departures']
        towTruck.count_evacuations = data['count_evacuations']
        towTruck.summary_of_parking_lot = data['summary_of_parking_lot']
        towTruck.save()
        return Response("Успешно обновленно", status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@admin_required
def deleteTowTruck(request: Request):
    try:
        data = request.data
        towTruck = TowTrucks.objects.get(id=data['id'])
        towTruck.delete()
        return Response("Успешно удалено", status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)