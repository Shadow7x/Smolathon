from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.decorators import api_view
from core.utils.parsers.excelParser import ExcelParser
from core.models.models import Detection, Detector, Car, Workload
from django.db import transaction
from core.utils.auth_decor import token_required,admin_required
from core.utils.serializers import CarSerializer, DetectionSerializer
import  pandas as pd
from django.utils import timezone
from datetime import timedelta
import datetime





@api_view(['POST'])
@admin_required
def createWorkloadFromExcel(request: Request) -> Response:
    if request.FILES.get('file'):
        try:
            file = request.FILES['file']
            file.name = "_".join(file.name.split())
            try:
                trafficLight = ExcelParser(file).df
                if list(trafficLight.columns) != ['ID_детектора',
                                                'Временная_метка',
                                                'Идентификатор_ТС',
                                                'Скорость_прохождения']:
                    print(list(trafficLight.columns))

                    return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
                trafficLight.columns =[
                                "detector",
                                "date",
                                "Car",
                                "speed"
                ]
                
                trafficLight = trafficLight.sort_values('Car').reset_index(drop=True)
                objs = []
                tek_car= Car()
                TIMES_INTERVAL = [(f"{hour:02d}:00-{hour+2:02d}:00", f"{hour:02d}:00-{hour+2:02d}:00") for hour in range(0, 24, 2)]
                detectors = Detector.objects.all()
                for row in trafficLight.itertuples(index=False, name=None):
                    if row[2] != tek_car.name:
                        if objs != []:
                            with transaction.atomic():
                                detects = Detection.objects.bulk_create(objs)
                            objs = []
                            
                            time_interval_str = row[1].strftime("%H:%M")
                            found_interval = next((i for i in TIMES_INTERVAL if time_interval_str >= i[0].split('-')[0] and time_interval_str < i[0].split('-')[1]), None)
                            if not found_interval:
                            # если не нашли — помещаем в последний диапазон
                                found_interval = TIMES_INTERVAL[-1]

                            time_interval = found_interval[0]
                            print(time_interval)
                            workload = Workload.objects.create(time_interval=time_interval)
                            for detect in detects:
                                workload.detections.add(detect)
                            workload.save()
                            tek_car.workloads.add(workload)
                            tek_car.save()
                            
                        tek_car = Car.objects.get_or_create(name=row[2])[0]
                    objs.append(Detection(
                        detector=detectors.filter(name=row[0]).first(),
                        time=timezone.make_aware(row[1]) if timezone.is_naive(row[1]) else row[1],
                        car=tek_car,
                        speed=row[3],
                    ))

                return Response("Данные загруженны", status=status.HTTP_201_CREATED)
                
            except Exception as e:
                print(e)
                

                return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
    return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@admin_required
def getWorkloads(request: Request):
    detections = Detection.objects.all().order_by("car__name")
    try:
        if request.GET.get("time_start") and request.GET.get("time_end"):
            time_start = datetime.time.fromisoformat(request.GET.get("time_start") + ':00')
            time_end = datetime.time.fromisoformat(request.GET.get("time_end") + ':59')
            detections = detections.filter(time__time__range=[time_start, time_end])
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
    
    workloads ={}
    for i in range(len(detections)):
        if i+1 < len(detections):
            workload= workloads.get(detections[i].detector.name+":"+detections[i+1].detector.name, {})
        
        if i+1 < len(detections):
            workload["count"] = workload.get("count", 0) + 1
            workload["start"] = [detections[i].detector.longitude,detections[i].detector.latitude]
            workload["end"] = [detections[i+1].detector.longitude,detections[i+1].detector.latitude]
            workloads[detections[i].detector.name+":"+detections[i+1].detector.name] = workload
            workload["speed"] = workload.get("speed", 0) + detections[i].speed
            workload["time"] = workload.get("time",0) + (detections[i+1].time - detections[i].time).total_seconds() // 60
                
    
    most_workloads= dict((sorted(workloads.items(), key =lambda x: x[1]["count"], reverse=True))[:10])
        
    for race , workload in most_workloads.items():
        
        workload['speed'] /= workload["count"]
        workload['time'] /= workload["count"]
    # serializer = CarSerializer(trafficLight, many=True)
    return Response(most_workloads, status=status.HTTP_200_OK)


@api_view(['GET'])
@admin_required
def getAdjacencies(request: Request):
    try:
        get = request.GET
        if get.get("target"):
            target = Car.objects.get(id=get.get("target"))
            if get.get("time_interval"):
                if target.workloads.filter(time_interval=get.get("time_interval")).exists():
                    target_workloads = target.workloads.filter(time_interval=get.get("time_interval"))
                else:
                    return Response("Некоректный запрос", status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response("Некоректный запрос", status=status.HTTP_400_BAD_REQUEST)
            nodes_count = int(get.get("nodes_count", 1))
            print(target)
            target_detection = Detection.objects.filter(
            id__in=target_workloads.values_list("detections__id", flat=True)
        ).order_by("time")
            
            target_nodes=[i.detector for i in target_detection]
            
            max_time_diff = timedelta(minutes=int(get.get("max_time_diff", 5)))
            
            count_other ={} 
            
            other_cars = Car.objects.exclude(id=target.id)
            
            for car in other_cars:
                if get.get("time_interval"):
                    other_workload= car.workloads.filter(time_interval=get.get("time_interval"))
                for workload in other_workload:
                    for detection in workload.detections.all():

                        time_diff = detection.time - target_detection.last().time
                        if time_diff < max_time_diff and detection.detector in target_nodes:
                            count_other[car] = count_other.get(car, 0) + 1
                
            
            # for detection in other_detections:
            #     time_diff = detection.time - target_detection.last().time
            #     if time_diff < max_time_diff and detection.detector in target_nodes:
            #         count_other[detection] = count_other.get(detection, 0) + 1
            print(count_other)
            count_other = list(filter(lambda x: x[1] >= nodes_count, count_other.items()))
            print(count_other)
            count_other = list(sorted(count_other, key=lambda x: x[1], reverse=True))
            print(count_other)
            Adjacency = list(map(lambda x: x[0], count_other))
            
            data = CarSerializer(Adjacency, many=True).data
            
            return Response(data, status=status.HTTP_200_OK)
            
                
            
        else:
            return Response("Некоректный запрос", status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        return Response("Некоректный запрос", status=status.HTTP_400_BAD_REQUEST)


    

# @api_view(['POST'])
# @admin_required
# def createTrafficLight(request: Request):
#     try:
#         data = request.data
#         report = Reports.objects.get(id=data['report'])
#         if TrafficLight.objects.filter(numPP=data['numPP']).exists():
#             return Response("Такая запись уже существует", status=status.HTTP_400_BAD_REQUEST)
#         TrafficLight.objects.create(numPP=data['numPP'], address=data['address'], type=data['type'], year=data['year'], report=report)

#         return Response("Успешно созданно", status=status.HTTP_201_CREATED)
#     except Exception as e:
#         print(e)
#         return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
    

# @api_view(['POST'])
# @admin_required
# def updateTrafficLight(request: Request):
#     try:
#         data = request.data
#         trafficLight = TrafficLight.objects.get(id=data['id'])
#         trafficLight.address = data['address']
#         trafficLight.type = data['type']
#         trafficLight.year = data['year']
#         trafficLight.save()
#         return Response("Успешно обновленно", status=status.HTTP_201_CREATED)
#     except Exception as e:
#         print(e)
#         return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)


# @api_view(['POST'])
# @admin_required
# def deleteTrafficLight(request: Request):
#     try:
#         data = request.data
#         penalties = TrafficLight.objects.get(id=data['id'])
#         penalties.delete()
#         return Response("Успешно удалено", status=status.HTTP_201_CREATED)
#     except Exception as e:
#         print(e)
#         return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)