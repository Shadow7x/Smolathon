from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.decorators import api_view
from core.utils.parsers.excelParser import ExcelParser
from core.models.models import Penalties, Reports
from django.db import transaction, close_old_connections
import threading
import  pandas as pd



@api_view(['POST'])
def createPenalties(request: Request) -> Response:
    if request.FILES.get('file'):
        try:
            file = request.FILES['file']
            file.name = "_".join(file.name.split())
            for report in Reports.objects.all():
                print(report.file)
                print(f"{report.file==file.name}")
            if Reports.objects.filter(file=file.name).exists():
                return Response("Такой отчет уже существует", status=status.HTTP_400_BAD_REQUEST)
            report = Reports.objects.create(file=file)
            try:
                penalties = ExcelParser(file).df
                if list(penalties.columns) != ['Дата',
                                                'Количество зафиксированных нарушений камерами ФВФ (нарастающим итогом)',
                                                'Количество вынесенных постановлений (нарастающим итогом)',
                                                'Сумма наложенных штрафов (нарастающим итогом)',
                                                'Сумма взысканных штрафов (нарастающим итогом)']:
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


