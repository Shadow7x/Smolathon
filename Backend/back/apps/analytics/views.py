from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.decorators import api_view
from core.utils.parsers.excelParser import ExcelParser


@api_view(['POST'])
def createPenalties(request: Request) -> Response:
    if request.FILES.get('file'):
        try:
            file = request.FILES['file']
            t = ExcelParser(file)
            print(t.df)
            return Response('Успешно', status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
    return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)
