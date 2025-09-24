from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.decorators import api_view
from core.utils.parsers.excelParser import ExcelParser
from core.models.models import EvacuationRoute, Reports, Route
from django.db import transaction
from core.utils.auth_decor import admin_required
from core.utils.serializers import EvacuationRouteSerializer
import  pandas as pd





@api_view(['POST'])
@admin_required
def createEvacuationRoute(request: Request) -> Response:
    if request.FILES.get('file'):
        try:
            file = request.FILES['file']
            file.name = "_".join(file.name.split())
            if Reports.objects.filter(file=file.name).exists():
                return Response("Такой отчет уже существует", status=status.HTTP_400_BAD_REQUEST)
            report = Reports.objects.create(file=file)
            try:
                evacuationRoute = ExcelParser(file).df
                if list(evacuationRoute.columns) != ['год',
                                                'месяц',
                                                'маршрут']:
                    report.delete()
                    return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
                evacuationRoute.columns = [
                            'year',
                            'month',
                            'routes'
                ]
                
                evacuationRoute = evacuationRoute.sort_values(['year', 'month']).reset_index(drop=True)
                objs = []
                routes = []
                for row in evacuationRoute.itertuples(index=False, name=None):
                    route_tmp = []
                    for route in row[2].split(' → '):
                        route_tmp.append(Route(
                            street=route
                        ))
                    
                    objs.append(EvacuationRoute(
                        year=row[0],
                        month=row[1],
                        
                        report=report
                    ))

                    routes.extend(route_tmp)
                    print(routes)
                with transaction.atomic():
                    resRoute = Route.objects.bulk_create(routes, batch_size=1000)
                    resEvo = EvacuationRoute.objects.bulk_create(objs, batch_size=1000)
                for i, obj in enumerate(resEvo):
                    obj.routes.add(*resRoute[i*5:(i+1)*5])
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
def getEvacuationRoute(request: Request):
    evacuationRoute = EvacuationRoute.objects.all()
    try:

        if request.GET.get("year"):
            evacuationRoute = evacuationRoute.filter(year=request.GET.get("year"))
        if request.GET.get("month"):
            evacuationRoute = evacuationRoute.filter(month=request.GET.get("month"))
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
    serializer = EvacuationRouteSerializer(evacuationRoute, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
