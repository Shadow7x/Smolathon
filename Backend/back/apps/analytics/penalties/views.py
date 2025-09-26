from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.decorators import api_view
from core.utils.parsers.excelParser import ExcelParser
from core.models.models import Penalties, Reports
from django.db import transaction
from core.utils.auth_decor import token_required, admin_required
from core.utils.serializers import PenaltiesSerializer
import  pandas as pd





@api_view(['POST'])
@admin_required
def createPenaltiesFromExcel(request: Request) -> Response:
    if request.FILES.get('file'):
        try:
            file = request.FILES['file']
            file.name = "_".join(file.name.split())
            if Reports.objects.filter(file=file.name).exists():
                return Response("Такой отчет уже существует", status=status.HTTP_400_BAD_REQUEST)
            report = Reports.objects.create(file=file)
            try:
                penalties = ExcelParser(file).df
                print(penalties)
                if list(penalties.columns) != ['Дата',
                                                'Количество зафиксированных нарушений камерами ФВФ (нарастающим итогом)',
                                                'Количество вынесенных постановлений (нарастающим итогом)',
                                                'Сумма наложенных штрафов (нарастающим итогом)',
                                                'Сумма взысканных штрафов (нарастающим итогом)']:
                    report.delete()
                    return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
                penalties.columns =[
                            'date',
                            'violations_cumulative',
                            'decrees_cumulative',
                            'fines_imposed_cumulative',
                            'fines_collected_cumulative'
                ]
                penalties['date'] = pd.to_datetime(penalties['date'])
                
                penalties = penalties.sort_values('date').reset_index(drop=True)
                objs = []
                for row in penalties.itertuples(index=False, name=None):
                    objs.append(Penalties(
                        date=row[0],
                        violations_cumulative=row[1],
                        decrees_cumulative=row[2],
                        fines_imposed_cumulative=row[3],
                        fines_collected_cumulative=row[4],
                        report=report
                    ))
                with transaction.atomic():
                    Penalties.objects.bulk_create(objs, batch_size=1000)

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
def getPenalties(request: Request):
    penalties = Penalties.objects.all()
    try:
        if request.GET.get('date'):
            penalties = penalties.filter(date=request.GET.get('date'))
        if request.GET.get('date_from') and request.GET.get('date_to'):
            penalties = penalties.filter(date__range=[request.GET.get('date_from'), request.GET.get('date_to')])
        if request.GET.get("year"):
            penalties = penalties.filter(date__year=request.GET.get("year"))
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
    serializer = PenaltiesSerializer(penalties, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@admin_required
def createPenalty(request: Request):
    try:
        data = request.data
        report = Reports.objects.get(id=data['report'])
        if Penalties.objects.filter(date=data['date']).exists():
            return Response("Такая запись уже существует", status=status.HTTP_400_BAD_REQUEST)
        Penalties.objects.create(date = data['date'], 
                                 violations_cumulative = data['violations_cumulative'],
                                 decrees_cumulative = data['decrees_cumulative'],
                                 fines_imposed_cumulative = data['fines_imposed_cumulative'],
                                 fines_collected_cumulative = data['fines_collected_cumulative'],
                                 report = report
                                 )

        return Response("Успешно созданно", status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
@admin_required
def updatePenalty(request: Request):
    try:
        data = request.data
        penalties = Penalties.objects.get(id=data['id'])
        penalties.violations_cumulative = data['violations_cumulative']
        penalties.decrees_cumulative = data['decrees_cumulative']
        penalties.fines_imposed_cumulative = data['fines_imposed_cumulative']
        penalties.fines_collected_cumulative = data['fines_collected_cumulative']
        penalties.save()
        return Response("Успешно обновленно", status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@admin_required
def deletePenalty(request: Request):
    try:
        data = request.data
        penalties = Penalties.objects.get(id=data['id'])
        penalties.delete()
        return Response("Успешно удалено", status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)