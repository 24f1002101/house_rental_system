from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from house.models import *
from .serializers import *

@api_view(['GET'])
def registered_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)
@api_view(['GET', 'PUT'])
def admin_profile(request):
    try:
        admin = Admin.objects.get(admin_id=3)
    except Admin.DoesNotExist:
        return Response({"error": "Admin not found"}, status=status.HTTP_404_NOT_FOUND)
    print(admin)
    if request.method == 'GET':
        print(admin)
        serializer = AdminSerializer(admin)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        print(request.data)

        serializer = UpdateAdminSerializer(admin, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile updated successfully", "admin": serializer.data}, status=status.HTTP_200_OK)
        else:
            print("Serializer errors:", serializer.errors)
            print("Request data:", request.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET','POST'])
def add_spot(request, lot_id):
    try:
        lot = Rental_lot.objects.get(lot_id=lot_id)
    except Rental_lot.DoesNotExist:
        return Response({'error': 'Lot not found'}, status=404)
    
    if(request.method=='GET'):
        return Response({
            'lot_id': lot.lot_id,
            'location': lot.location,
            'pincode': lot.pincode
        },status=status.HTTP_200_OK)
    
    elif(request.method=='POST'):
        address = request.data.get('address', '').strip().lower()
        rental_type = request.data.get('room', '').strip().lower()
        try:
            price = int(request.data.get('price', 0))
        except ValueError:
            return Response({'message': 'Price must be a number'}, status=400)

        if len(rental_type) > 4:
            return Response({'message': 'Room type too long'}, status=400)
        if rental_type not in ['1bhk', '2bhk', '3bhk']:
            return Response({'message': 'Invalid room type'}, status=400)
        if price <= 3000:
            return Response({'message': 'Price must be greater than 3000'}, status=400)
        if len(address) > 75:
            return Response({'message': 'Address too long'}, status=400)
        if lot.location.lower() not in address:
            return Response({'message': 'Invalid address'}, status=400)

        Rental_spot.objects.create(
            lot=lot,
            status='A',
            price=price,
            address=address,
            location=lot.location.lower(),
            type=rental_type
        )
        return Response({'message': 'Spot added successfully'}, status=201)


@api_view(['POST'])
def add_lot(request):
    location = request.data.get('location', '').strip()
    pincode = request.data.get('pin', '').strip()
    lots = Rental_lot.objects.all()
    found1=0
    found2=0
    for i in lots:
        if(location and i.location.lower()==location.lower()):
            found1=1
            break
    for i in lots:
        if(pincode and int(i.pincode)==int(pincode)):
            found2=1
            break
    if len(location) > 50:
        return Response({'error': 'Location name must be less than 51 characters.'}, status=status.HTTP_400_BAD_REQUEST)

    if len(pincode) > 6:
        return Response({'error': 'Pincode must be less than 7 digits.'}, status=status.HTTP_400_BAD_REQUEST)
    elif(len(pincode) < 6):
        return Response({'error': 'Pincode must not be less than 6 digits.'}, status=status.HTTP_400_BAD_REQUEST)
    if found1:
        return Response({'error': 'Location already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    if found2:
        return Response({'error': 'Pincode already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    data = {}
    if(pincode and location):
        new_lot = Rental_lot.objects.create(location=location, pincode=int(pincode))
        data = {
                'lot_id': new_lot.lot_id,
                'location': new_lot.location,
                'pincode': new_lot.pincode
        }

        return Response({'message': 'Lot added successfully!', 'data':data}, status=status.HTTP_201_CREATED)
    

@api_view(['GET'])
def expand_lot(request, lot_id):
    try:
        lot = Rental_lot.objects.get(lot_id=lot_id)
    except Rental_lot.DoesNotExist:
        return Response({'error': 'Lot not found'}, status=status.HTTP_404_NOT_FOUND)

    spots = lot.rental_spot_set.all()

    lot_data = {
        'lot_id': lot.lot_id,
        'location': lot.location,
        'pincode': lot.pincode
    }

    spots_data = [
        {
            'spot_id': spot.spot_id,
            'address': spot.address,
            'room_type': spot.type,
            'price': spot.price,
            'status': spot.status,
            'location':spot.location
        }
        for spot in spots
    ]

    return Response({'lot': lot_data, 'spots': spots_data}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_lot(request, lot_id):
    try:
        lot = Rental_lot.objects.get(lot_id=lot_id)
    except Rental_lot.DoesNotExist:
        return Response({'error': 'Lot not found'}, status=status.HTTP_404_NOT_FOUND)

    spots = lot.rental_spot_set.all()
    occupied_count = 0
    for i in spots:
        if(i.status=='O'):
            occupied_count +=1

    if occupied_count > 0:
        return Response(
            {'error': 'Cannot delete the lot because it has occupied spots.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    data = {
        'lot_id':lot.lot_id,
        'location':lot.location,
        'pincode':lot.pincode
    }
    lot.delete()
    return Response({'message': 'Lot deleted successfully!','deleted_data':data}, status=status.HTTP_200_OK)


@api_view(['GET','PUT'])
def edit_spot(request, lot_id, spot_id):
    if(request.method=='GET'):
        try:
            lot = Rental_lot.objects.get(lot_id=lot_id)
            spot = Rental_spot.objects.get(spot_id=spot_id, lot=lot)
        except Rental_lot.DoesNotExist:
            return Response({'error': 'Lot not found'}, status=status.HTTP_404_NOT_FOUND)
        except Rental_spot.DoesNotExist:
            return Response({'error': 'Spot not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            'spot_id': spot.spot_id,
            'lot_id': lot.lot_id,
            'address': spot.address,
            'price': spot.price,
            'type': spot.type,
            'status': spot.status,
            'lot_location': lot.location
        }, status=status.HTTP_200_OK)
    
    elif(request.method=='PUT'):
        try:
            lot = Rental_lot.objects.get(lot_id=lot_id)
            spot = Rental_spot.objects.get(spot_id=spot_id, lot=lot)
        except Rental_lot.DoesNotExist:
            return Response({'error': 'Lot not found'}, status=status.HTTP_404_NOT_FOUND)
        except Rental_spot.DoesNotExist:
            return Response({'error': 'Spot not found'}, status=status.HTTP_404_NOT_FOUND)

        rental_type = request.data.get('room', '').strip().lower()
        price = request.data.get('price')
        address = request.data.get('address', '').strip().lower()
        print(address)
        if rental_type in ['1bhk', '2bhk', '3bhk']:
            spot.type = rental_type
        elif rental_type:
            return Response({'error': 'Room type must be 1bhk, 2bhk, or 3bhk.'}, status=status.HTTP_400_BAD_REQUEST)

        if price:
            try:
                price = int(price)
                if price <= 3000:
                    raise ValueError
                spot.price = price
            except ValueError:
                return Response({'error': 'Price must be an integer greater than 3000.'}, status=status.HTTP_400_BAD_REQUEST)

        if address:
            if len(address) > 75:
                return Response({'error': 'Address must be less than 76 characters.'}, status=status.HTTP_400_BAD_REQUEST)
            if lot.location.lower() not in address:
                print(2)
                print(lot.location.lower())
                return Response({'message': 'Invalid address'}, status=400)
            spot.address = address

        spot.save()
        return Response({
            'message': 'Spot updated successfully.',
            'data': {
                'spot_id': spot.spot_id,
                'lot_id': lot.lot_id,
                'address': spot.address,
                'price': spot.price,
                'type': spot.type,
                'status': spot.status,
            }
        }, status=status.HTTP_200_OK)

@api_view(['GET'])
def view_spot(request, lot_id, spot_id):
    try:
        lot = Rental_lot.objects.get(lot_id=lot_id)
    except Rental_lot.DoesNotExist:
        return Response({'error': 'Lot not found'}, status=status.HTTP_404_NOT_FOUND)

    try:
        spot = Rental_spot.objects.get(spot_id=spot_id, lot=lot)
    except Rental_spot.DoesNotExist:
        return Response({'error': 'Spot not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        try:
            booked = Registered_spot.objects.get(lot=lot, spot=spot, leaving_time=None)
        except Registered_spot.DoesNotExist:
            return Response({'error': 'No active booking found for this spot'}, status=status.HTTP_404_NOT_FOUND)

        daily_amount = booked.spot.price / 30
        registered_time = booked.registered_time
        time_diff = timezone.now() - registered_time
        total_amount = time_diff.days * daily_amount

        return Response({
            'lot_id': lot.lot_id,
            'spot_id': spot.spot_id,
            'booked_user': booked.user.name if hasattr(booked, 'user') else None,
            'registered_time': booked.registered_time,
            'daily_amount': daily_amount,
            'days_elapsed': time_diff.days,
            'total_amount': total_amount,
            'spot_details': {
                'address': spot.address,
                'price': spot.price,
                'type': spot.type,
                'status': spot.status,
            }
        }, status=status.HTTP_200_OK)

@api_view(['GET'])
def delete_spot(request,lot_id,spot_id):
    if(request.method=='GET'):
        try:
            lot = Rental_lot.objects.get(lot_id=lot_id)
        except Rental_lot.DoesNotExist:
            return Response({'error':'Lot not found'},status=status.HTTP_400_BAD_REQUEST)
        try:
            spot = Rental_spot.objects.get(spot_id=spot_id,lot=lot)
        except Rental_spot.DoesNotExist:
            return Response({'error':'spot not found'},status=status.HTTP_400_BAD_REQUEST)
        if(spot.status=='O'):
            return Response({'error':'cannot delete the spot because it is occupied'},status=status.HTTP_400_BAD_REQUEST)
        details = {
            'spot_id': spot.spot_id,
            'price': spot.price,
            'address':spot.address,
            'location':spot.location,
            'type':spot.type
        }
        spot.delete()
        return Response({'details':details},status=status.HTTP_200_OK)

@api_view(['GET'])
def summary(request):
    lots = Rental_lot.objects.all()
    result = []

    for lot in lots:
        spots = lot.rental_spot_set.all()
        total_spots = spots.count()
        available = spots.filter(status='A').count()
        occupied = spots.filter(status='O').count()

        using = Registered_spot.objects.filter(lot=lot, leaving_time__isnull=True)
        used = Registered_spot.objects.filter(lot=lot, leaving_time__isnull=False)
        registered = Registered_spot.objects.filter(lot=lot)

        total_cost = 0
        total_days = 0.0

        for reg in registered:
            if reg.registered_time:
                end_time = reg.leaving_time if reg.leaving_time else timezone.now()
                time_diff = end_time - reg.registered_time
                days = int(time_diff.total_seconds() / (24 * 60 * 60) )
                total_days += days
                cost = int(reg.spot.price / 30) * days  
                total_cost += cost

        result.append({
            "lot_id": lot.lot_id,
            "lot_location": lot.location,
            "total_spots": total_spots,
            "available_spots": available,
            "occupied_spots": occupied,
            "total_registered_days": round(total_days, 2),
            "total_earned_cost": round(total_cost, 2),
            "currently_in_use": using.count(),
            "completed_bookings": used.count()
        })
    return Response({"summary": result},status=status.HTTP_200_OK)


@api_view(['GET','POST'])
def admin_search(request):
   
    parameter = request.data.get('parameter', '').strip().lower()
    value = request.data.get('value', '').strip()

    all_lots = Rental_lot.objects.all()
    all_data = [serialize_lot(lot) for lot in all_lots]
    if(request.method=='GET'):
        return Response({"lots": all_data}, status=status.HTTP_200_OK)
    elif(request.method=='POST'):
        if not parameter:
            return Response({"lots": all_data}, status=status.HTTP_200_OK)

        # Case 2: Search by user_id
        if parameter == 'user_id':
            if not value.isdigit():
                return Response(
                    {
                        "error": "User ID must be a valid integer.",
                        "lots": all_data
                    },
                    status=status.HTTP_200_OK,
                )

            try:
                user = User.objects.get(user_id=int(value))
            except User.DoesNotExist:
                return Response(
                    {
                        "error": "User not found.",
                        "lots": all_data
                    },
                    status=status.HTTP_200_OK,
                )

            registered = Registered_spot.objects.filter(user=user, leaving_time__isnull=True)
            lot_ids = registered.values_list('lot_id', flat=True).distinct()
            lots = Rental_lot.objects.filter(lot_id__in=lot_ids)
            data = [serialize_lot(lot) for lot in lots]
            return Response({"lots": data}, status=status.HTTP_200_OK)

        if parameter == 'location':
            if not value:
                return Response(
                    {
                        "error": "Please provide a location value.",
                        "lots": all_data
                    },
                    status=status.HTTP_200_OK,
                )
            lots = Rental_lot.objects.filter(location__icontains=value)
            data = [serialize_lot(lot) for lot in lots]
            if not data:
                return Response(
                    {
                        "error": "No lots found for this location.",
                        "lots": all_data
                    },
                    status=status.HTTP_200_OK,
                )
            return Response({"lots": data}, status=status.HTTP_200_OK)


        if parameter == 'pincode':
            if not value or not value.isdigit():
                return Response(
                    {
                        "error": "Please provide a valid numeric pincode.",
                        "lots": all_data
                    },
                    status=status.HTTP_200_OK,
                )
            lots = Rental_lot.objects.filter(pincode__icontains=value)
            data = [serialize_lot(lot) for lot in lots]
            if not data:
                return Response(
                    {
                        "error": "No lots found for this pincode.",
                        "lots": all_data
                    },
                    status=status.HTTP_200_OK,
                )
            return Response({"lots": data}, status=status.HTTP_200_OK)

        return Response(
            {
                "error": "Invalid parameter. Use user_id, location, or pincode.",
                "lots": all_data
            },
            status=status.HTTP_200_OK,
        )
