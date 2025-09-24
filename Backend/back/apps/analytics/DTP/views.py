from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.decorators import api_view
from core.utils.parsers.csvParser import CsvParser 
from core.models.models import DTP, Reports
from django.db import transaction
from core.utils.auth_decor import admin_required
from core.utils.serializers import DTPSerializer
import  pandas as pd





@api_view(['POST'])
@admin_required
def createDTP(request: Request) -> Response:
    if request.FILES.get('file'):
        try:
            file = request.FILES['file']
            file.name = "_".join(file.name.split())
            if Reports.objects.filter(file=file.name).exists():
                return Response("Такой отчет уже существует", status=status.HTTP_400_BAD_REQUEST)
            report = Reports.objects.create(file=file) 
            try:
                dtp = CsvParser(file).df
                if 'Субъект' not in list(dtp.columns) or 'Пункт ФПСР' not in list(dtp.columns) or 'Наименование статистического показателя' not in list(dtp.columns):
                    report.delete()
                    return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
                date = list(dtp.columns)[-1] #Значение статистического показателя (за январь-июль 2025 года)

                valid_date = date.split("-")[1].replace(")", "").split(" ") #["июль"," 2025", "года"]
                if valid_date[0]== "":
                    valid_date.pop(0) 
                year = valid_date[1]
                month = valid_date[0]
                smol_obl =[]
                for row in dtp.itertuples(index=False, name=None):

                    if "Смоленская область" in row[0]:
                        smol_obl.append(DTP(
                            year = year,
                            month = month,
                            point_FPSR = row[1],
                            statistical_factor = row[2],
                            count = float(row[3].replace(",", ".")),
                            report = report
                        ))

                
                with transaction.atomic():
                    DTP.objects.bulk_create(smol_obl)

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
def getDTP(request: Request):
    dtp = DTP.objects.all()
    try:
        if request.GET.get("year"):
            dtp = dtp.filter(date__year=request.GET.get("year"))        
        if request.GET.get("month"):
            dtp = dtp.filter(month=request.GET.get("month"))
        if request.GET.get("type"):
            dtp = dtp.filter(statistical_factor=request.GET.get("type"))
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
    serializer = DTPSerializer(dtp, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
