from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.models import Products, Review
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from base.products import products
#serializar es lo que convierte la data a json para ser enviada al cliente
from base.serializer import ProductsSerializer

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth.hashers import make_password
#esta importacion se encarga de hacer la encriptacion de la contrasena para guardarla en la base de datos 

from rest_framework import status
#funcion ppara custom msg 


@api_view(['GET'])
def getProducts(request): 
    query = request.query_params.get('keyword')
    
    if(query == None):
        query = ''

    products = Products.objects.filter(name__icontains=query)
    page = request.query_params.get('page')
    paginator = Paginator(products,4)
    
    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)
        
    if page == None:
        page = 1 
    page = int(page)

    serializer = ProductsSerializer(products, many=True)
    #el many se coloca true sin son varis archivos y false son uno solo 
    return Response({'products' : serializer.data, 'page': page, 'pages': paginator.num_pages} )


@api_view(['GET'])
def getTopProducts(request):
    products = Products.objects.filter(raiting__gt=4).order_by('-raiting')[0:5] 
    # este filter me dara todos los productos con raiting de 4 o mas lo que esta dentro de los corchetes me dara el limites el (-) dentro de ratiign es para que sea de mayor a menor
    serializer = ProductsSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getProduct(request, pk):
    product = Products.objects.get(_id=pk)
    serializer = ProductsSerializer(product,many = False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data 
    product = Products.objects.get(_id=pk )  
    
    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.countInStock = data['countInStock']
    product.category = data['category']
    product.save()
     
    serializer = ProductsSerializer(product, many=False)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = Products.objects.get(_id=pk)
    product.delete()
    return Response('Produt Deleted') 


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):   
    user = request.user
    product = Products.objects.create(
        user= user,
        name = 'Sample name',
        price = 0, 
        brand = "Sample Brand",
        countInStock = 0, 
        category = "Sample Category",
        description = ""

    )
    serializer = ProductsSerializer(product,many = False)
    return Response(serializer.data)


@api_view(['POST'])
def uploadImage(request):
    data = request.data
    print(data)
    product_id = data['product_id']   
    product = Products.objects.get(_id = product_id)
    product.image = request.FILES.get('image')
    product.save()
    return Response('Image was uploaded')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user 
    product = Products.objects.get(_id = pk )
    data = request.data
    #1 - review already exists 
    alreadyExist = product.review_set.filter(user = user).exists()
    if alreadyExist:
        content = {'detail': 'Product already reviewed' }
        return Response(content, status =  status.HTTP_400_BAD_REQUEST)

    #2 No rating  or 0
    elif data['raiting'] == 0:
        content = {'detail': 'Please Select a Raiting' }
        return Response(content, status =  status.HTTP_400_BAD_REQUEST)

    #3 Create Review 
    else:
        review = Review.objects.create(
            user = user,
            product = product,  
            name = user.first_name, 
            raiting = data['raiting'], 
            comment = data['comment'], 
        )
        reviews = product.review_set.all()
        product.numReviews = len(reviews)
        total = 0 
        for i in reviews:
            total += i.raiting
        product.rating = total / product.numReviews
        product.save()

        return Response('Review added')
