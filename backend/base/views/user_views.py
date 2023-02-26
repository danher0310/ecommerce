from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.models import User


#serializar es lo que convierte la data a json para ser enviada al cliente
from base.serializer import UserSerializer, UserSerializerWithToken

from django.contrib.auth.hashers import make_password
#esta importacion se encarga de hacer la encriptacion de la contrasena para guardarla en la base de datos 

# Create your views here.
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from base import serializer
from rest_framework import status
#funcion ppara custom msg 

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs) 
        serializer = UserSerializerWithToken(self.user).data

        for k,v in serializer.items():
            data[k] = v
        return data
    # esta es la funcion que genera lel token 


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
#en esta funcion tenemos una view que se devuelve con el token del usuario 

@api_view(['POST'])
def registerUser(request):
    try:
        data = request.data
        user = User.objects.create(
            first_name = data['name'],
            username = data['email'],
            email = data['email'],
            password = make_password(data['password'])
        )
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except:
        message = {'details' :'User with this email alredy exist' }
        return Response(message, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET']) 
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['PUT']) 
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)
    data = request.data 
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    if data['password'] != '':
        user.password = make_password(data['password'])
    
    user.save()

    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    #el many se coloca true sin son varis archivos y false son uno solo
    return Response(serializer.data) 

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsersById(request, pk):
    user = User.objects.get(id = pk)
    serializer = UserSerializer(user, many=False)
    #el many se coloca true sin son varis archivos y false son uno solo
    return Response(serializer.data) 


@api_view(['PUT']) 
@permission_classes([IsAuthenticated])
def updateUser(request, pk):
    user = User.objects.get(id = pk)    
    data = request.data 
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    user.is_staff = data['isAdmin']
    serializer = UserSerializer(user, many=False)
   
    
    user.save()

    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUsers(request, pk):
    userForDeletion = User.objects.get(id=pk)
    userForDeletion.delete()
    return Response('User Was deleted')
