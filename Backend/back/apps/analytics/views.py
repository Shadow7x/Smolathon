from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view
from core.utils.parsers.excelParser import PenaltiesParser


@api_view(['POST'])
def createPenalties(request: Request) -> Response:
    
    return Response({"message": "Hello, world!"})