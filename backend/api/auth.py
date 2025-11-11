from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from house.models import *
from .serializers import *
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password, check_password

@api_view(['POST'])
def custom_token_refresh(request):
    refresh_token = request.data.get("refresh")

    if not refresh_token:
        return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        refresh = RefreshToken(refresh_token)
        new_access_token = refresh.access_token

        return Response({
            "access": str(new_access_token)
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        print("Error refreshing token:", e)
        return Response({"error": "Invalid or expired refresh token"}, status=status.HTTP_400_BAD_REQUEST)

def get_tokens_for_user(user):
    """
    Manually creates JWT tokens for a given user (Admin or User model).
    This avoids the 'id' attribute error by not using RefreshToken.for_user().
    """
    refresh = RefreshToken()

    # Add custom claims to the token's payload
    if isinstance(user, Admin):
        # The FIX: The claim MUST be 'user_id' to match what the library expects by default.
        refresh['user_id'] = user.admin_id 
        refresh['role'] = 'admin'
        refresh['name'] = user.admin_name
        refresh['email'] = user.admin_email
    elif isinstance(user, User):
        # The FIX: The claim MUST be 'user_id' for the library to find the user.
        refresh['user_id'] = user.user_id
        refresh['role'] = 'user'
        refresh['name'] = user.name
        refresh['email'] = user.user_email
    else:
        return None
    print(str(refresh))
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['POST'])
def role(request):
    role = request.data.get('role')
    if role == 'User':
        return Response({'redirect_to': 'user_index'}, status=status.HTTP_200_OK)
    elif role == 'Admin':
        return Response({'redirect_to': 'admin_index'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid role selected'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def user_index(request):
    email = request.data.get('email')
    password = request.data.get('password')
    try:
        user = User.objects.get(user_email=email)
        # IMPORTANT: Use check_password for security
        if not check_password(password, user.password):
            return Response({'error': 'password_not_matched'}, status=status.HTTP_401_UNAUTHORIZED)
        
        tokens = get_tokens_for_user(user)
        return Response({
            'redirect_to': 'user_homepage',
            'user_id': user.user_id,
            'tokens': tokens  # Send tokens to the frontend
        }, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'redirect_to': 'registration'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def user_register(request):
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        # IMPORTANT: Hash the password before saving
        user = serializer.save(password=make_password(serializer.validated_data['password']))
        return Response({
            'message': 'Successfully Registered!',
            'redirect_to': 'user_index'
        }, status=status.HTTP_201_CREATED)
    else:
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def index(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        admin = Admin.objects.get(admin_email=email)
        # IMPORTANT: Use check_password for security
        if not check_password(password, admin.password):
             return Response({'error': 'Invalid password !!!'}, status=status.HTTP_401_UNAUTHORIZED)

        tokens = get_tokens_for_user(admin)
        data = {
            'admin_id': admin.admin_id,
            'admin_name': admin.admin_name,
            'admin_email': admin.admin_email,
        }
        return Response({
            'message': 'Login successful', 
            'admin': data, 
            'tokens': tokens # Send tokens to the frontend
        }, status=status.HTTP_200_OK)
    except Admin.DoesNotExist:
        return Response({'error': 'Invalid email or password!'}, status=status.HTTP_401_UNAUTHORIZED)

# --- SECURED ENDPOINTS ---

@api_view(['GET'])
@permission_classes([IsAuthenticated]) # This endpoint is now protected
def admin_homepage(request):
    if not isinstance(request.user, Admin):
        return Response({'error': 'Permission denied. Admin access required.'}, status=status.HTTP_403_FORBIDDEN)
    try:
        # request.user will hold the authenticated user from the token
        admin = request.user
        lots = Rental_lot.objects.all()
        result = []

        for lot in lots:
            spots = Rental_spot.objects.filter(lot=lot)

            available = sum(1 for s in spots if s.status == 'A')
            occupied = sum(1 for s in spots if s.status == 'O')
            total = len(spots)
            lot_data = {
                'lot_id': lot.lot_id,
                'location': lot.location,
                'pincode': lot.pincode,
                'available_spots': available,
                'occupied_spots': occupied,
                'total_spots': total,
                'spots': [
                    {
                        'spot_id': s.spot_id,
                        'status': s.status,
                        'price': s.price,
                        'address': s.address,
                        'location': s.location,
                        'type': s.type
                    }
                    for s in spots
                ]
            }
            result.append(lot_data)
        data = {
            'admin': {
                'admin_id': admin.admin_id,
                'admin_name': admin.admin_name,
                'admin_email': admin.admin_email
            },
            'lots': result
        }

        return Response(data, status=status.HTTP_200_OK)

    except Admin.DoesNotExist:
        return Response({'error': 'Admin not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated]) # This endpoint is now protected
def user_homepage(request, user_id):
    # Security check: Ensure the user from the token matches the requested user_id
    if not isinstance(request.user, User):
        return Response({'error': 'Permission denied. User access required.'}, status=status.HTTP_403_FORBIDDEN)
    
    if request.user.user_id != user_id:
        return Response({'error': 'Forbidden: You can only access your own homepage.'}, status=status.HTTP_403_FORBIDDEN)
    try:
        user = request.user
        lots = Rental_lot.objects.all()
        result = []

        for lot in lots:
            available_spots = Rental_spot.objects.filter(lot=lot, status='A')

            lot_data = {
                'lot_id': lot.lot_id,
                'location': lot.location,
                'pincode': lot.pincode,
                'available_spots': [
                    {
                        'spot_id': spot.spot_id,
                        'price': spot.price,
                        'address': spot.address,
                        'location': spot.location,
                        'type': spot.type,
                        'status': spot.status
                    }
                    for spot in available_spots
                ]
            }
            result.append(lot_data)

        response_data = {
            'user': {
                'user_id': user.user_id,
                'user_name': user.name,
                'user_email': user.user_email,
                'address': user.address,
                'pincode': user.pincode
            },
            'lots': result
        }

        return Response(response_data, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)