from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.decorators import api_view
from core.models.models import Merits, ImageForMerits
from core.utils.auth_decor import token_required
from core.utils.serializers import MeritsSerializer
from django.http import FileResponse, Http404
from django.conf import settings
import os


@api_view(['GET'])
def getMerits(request: Request):
    merits = Merits.objects.all()
    if request.GET.get("id"):
        merits = merits.filter(id=request.GET.get("id")).first()
            
    serializer = MeritsSerializer(merits, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@token_required
def createMerit(request: Request):
    try:
        data = request.data
        title = data['title']
        if Merits.objects.filter(title=title).exists():
            return Response('Такая заслуга уже существует', status=status.HTTP_400_BAD_REQUEST)
        decode = data['decode']
        purposes = data['purposes']
        parents_name = data['parents_name']
        parents_phone = data['parents_phone']
        parents_email = data['parents_email']
        address = data['address']
        
        files = request.FILES
        if files.get('logo_first_block') and files.get('logo_second_block') and files.getlist('images_first_block[]') and files.getlist('images_second_block[]'):     
            logo_first_block = files.get('logo_first_block')
            logo_second_block = files.get('logo_second_block')
            images_first_block = files.getlist('images_first_block[]')
            images_second_block = files.getlist('images_second_block[]')

            merits = Merits.objects.create(title=title, decode=decode, purposes=purposes,
                parents_name=parents_name, parents_phone=parents_phone, parents_email=parents_email, address=address,
                logo_first_block=logo_first_block, logo_second_block=logo_second_block)
            for image in images_first_block:
                i = ImageForMerits.objects.create( image=image)
                merits.images_first_block.add(i)
            for image in images_second_block:
                i = ImageForMerits.objects.create( image=image)
                merits.images_second_block.add(i)
        else:
            return Response('Не все фотографии указанны', status=status.HTTP_400_BAD_REQUEST) 
        
        return Response('Заслуга успешно созданна', status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response( 'Заслуга не созданна', status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
@token_required
def deleteMerit(request: Request):
    try:
        data = request.data
        merits = Merits.objects.get(id=data['id'])
        for image in merits.images_first_block.all():
            image.image.delete()

        for image in merits.images_second_block.all():
            image.image.delete()
        
        merits.logo_first_block.delete()
        merits.logo_second_block.delete()
        
        merits.delete()
        return Response("Успешно удалено", status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@token_required
def updateMerit(request: Request):
    try:
        data = request.data
        merits = Merits.objects.get(id=data['id'])
        merits.title = data.get('title', merits.title)
        merits.decode = data.get('decode', merits.decode)
        merits.purposes = data.get('purposes', merits.purposes)
        merits.parents_name = data.get('parents_name', merits.parents_name)
        merits.parents_phone = data.get('parents_phone', merits.parents_phone)
        merits.parents_email = data.get('parents_email', merits.parents_email)
        merits.address = data.get('address', merits.address)
        print(data)
        files = request.FILES
        print(files)
        if files.get('logo_first_block'):
            logo_first_block = files.get('logo_first_block')
            merits.logo_first_block.delete()
            merits.logo_first_block = logo_first_block
        
        if files.get('logo_second_block'):
            logo_second_block = files.get('logo_second_block')
            merits.logo_second_block.delete()
            merits.logo_second_block = logo_second_block

        if data.getlist('images_first_block[]'):
            images_first_block = data.getlist('images_first_block[]')
            print(images_first_block)
            for image, new_image in zip(merits.images_first_block.all(), images_first_block):
                
                
                if new_image != 'false':
                    print(image)
                    print(new_image)
                    image.image.delete()
                    merits.images_first_block.remove(image)
                    i = ImageForMerits.objects.create( image=new_image)
                    merits.images_first_block.add(i)
                    

        if data.getlist('images_second_block[]'):
            images_second_block = data.getlist('images_second_block[]')
            print(images_second_block)
            for image, new_image in zip(merits.images_second_block.all(), images_second_block):
                if new_image != 'false':
                    print(image)
                    print(new_image)
                    image.image.delete()
                    merits.images_second_block.remove(image)
                    i = ImageForMerits.objects.create( image=new_image)
                    merits.images_second_block.add(i)

        merits.save()

        return Response("Успешно обновленно", status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)

