from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from house.models import *

@api_view(['GET', 'PUT'])
def user_profile(request, user_id):
    try:
        user = User.objects.get(user_id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response({
            'user_id': user.user_id,
            'name': user.name,
            'user_email': user.user_email,
            'address': user.address,
            'pincode': user.pincode
        }, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        data = request.data
        name = data.get('name')
        email = data.get('email')
        address = data.get('address')
        pincode = data.get('pincode')

        if name and len(name) > 45:
            return Response({'error': 'Name must be less than 46 characters'}, status=status.HTTP_400_BAD_REQUEST)
        if email and '@gmail.com' not in email:
            return Response({'error': 'Email must contain @gmail.com'}, status=status.HTTP_400_BAD_REQUEST)
        if address and len(address) > 75:
            return Response({'error': 'Address must be less than 76 characters'}, status=status.HTTP_400_BAD_REQUEST)
        if pincode and len(str(pincode)) > 6:
            return Response({'error': 'Pincode must be less than 7 digits'}, status=status.HTTP_400_BAD_REQUEST)

        if name: user.name = name
        if email: user.user_email = email
        if address: user.address = address
        if pincode: user.pincode = int(pincode)

        user.save()
        data = {
            'user_id': user.user_id,
            'name': user.name,
            'user_email': user.user_email,
            'address': user.address,
            'pincode': user.pincode
        }
        return Response({'message': 'Profile updated successfully','updated_data':data}, status=status.HTTP_200_OK)
    
@api_view(['GET', 'POST'])
def book_spot(request, lot_id, spot_id, user_id):
    try:
        user = User.objects.get(user_id=user_id)
        lot = Rental_lot.objects.get(lot_id=lot_id)
        spot = Rental_spot.objects.get(spot_id=spot_id, lot=lot)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Rental_lot.DoesNotExist:
        return Response({'error': 'Lot not found'}, status=status.HTTP_404_NOT_FOUND)
    except Rental_spot.DoesNotExist:
        return Response({'error': 'Spot not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response({
            'lot_id': lot.lot_id,
            'spot_id': spot.spot_id,
            'spot_status': spot.status,
            'user_id': user.user_id,
        }, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        phone = request.data.get('phone')
        if not phone or len(str(phone)) > 10 or len(str(phone))<10 :
            return Response({'error': 'Phone number must be 10 digits'}, status=status.HTTP_400_BAD_REQUEST)
        if(spot.status=='O'):
            return Response({'error': 'Cannot be booked beacuse it is occupied !!!'}, status=status.HTTP_400_BAD_REQUEST)
        Registered_spot.objects.create(
            lot=lot,
            spot=spot,
            user=user,
            phone_number=int(phone)
        )
        spot.status = 'O'
        spot.save()

        return Response({'message': 'Spot successfully booked'}, status=status.HTTP_200_OK)
    
@api_view(['GET'])
def user_history(request, user_id):
    try:
        user = User.objects.get(user_id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        history = Registered_spot.objects.filter(user_id=user_id)
        booking_list = []
        for booking in history:
            booking_list.append({
                'booking_id': booking.registered_id,
                'lot_id': booking.lot.lot_id,
                'spot_id': booking.spot.spot_id,
                'location': booking.lot.location,
                'address': booking.spot.address,
                'phone_number': booking.phone_number,
                'registered_time': booking.registered_time,
                'leaving_time': booking.leaving_time,
                'can_release': booking.leaving_time is None
            })
        return Response({'user_id': user.user_id, 'history': booking_list}, status=status.HTTP_200_OK)
    
@api_view(['GET'])
def user_summary(request, user_id):
    try:
        user = User.objects.get(user_id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    history = Registered_spot.objects.filter(user=user, leaving_time__isnull=False)

    result = []
    for booking in history:
        time_delta = booking.leaving_time - booking.registered_time
        days_spent = time_delta.days
        daily_amount = int(booking.spot.price / 30) 
        total_amount = days_spent * daily_amount

        result.append({
            'lot_id': booking.lot.lot_id,
            'location': booking.lot.location,
            'pincode': booking.lot.pincode,
            'spot_id': booking.spot.spot_id,
            'address': booking.spot.address,
            'room_type': booking.spot.type,
            'phone_number': booking.phone_number,
            'booked_time': booking.registered_time,
            'leaving_time': booking.leaving_time,
            'days_spent': days_spent,
            'amount_spent': total_amount,
        })

    return Response({'user_id': user.user_id, 'summary': result}, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
def release_spot(request, lot_id, spot_id, user_id):
    try:
        user = User.objects.get(user_id=user_id)
        lot = Rental_lot.objects.get(lot_id=lot_id)
        spot = Rental_spot.objects.get(spot_id=spot_id, lot=lot)
        booking = Registered_spot.objects.get(lot=lot, spot=spot, user=user, leaving_time=None)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Rental_lot.DoesNotExist:
        return Response({'error': 'Lot not found'}, status=status.HTTP_404_NOT_FOUND)
    except Rental_spot.DoesNotExist:
        return Response({'error': 'Spot not found'}, status=status.HTTP_404_NOT_FOUND)
    except Registered_spot.DoesNotExist:
        return Response({'error': 'Active booking not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        present_time = timezone.now()
        time_delta = present_time - booking.registered_time
        days_spent = time_delta.days
        daily_amount = int(spot.price / 30)
        total_amount = days_spent * daily_amount

        return Response({
            'booking_id': booking.registered_id,
            'lot_id': lot.lot_id,
            'spot_id': spot.spot_id,
            'address': spot.address,
            'room_type': spot.type,
            'booked_time': booking.registered_time,
            'current_time': present_time,
            'days_spent': days_spent,
            'total_amount': total_amount
        }, status=status.HTTP_200_OK)
    elif request.method=='POST' :
        booking.leaving_time = timezone.now()
        spot.status = 'A'  
        spot.save()
        booking.save()
        return Response({'message': 'Spot successfully released'}, status=status.HTTP_200_OK)