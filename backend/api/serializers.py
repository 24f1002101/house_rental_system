from rest_framework import serializers
from house.models import Admin, User, Rental_lot, Rental_spot, Registered_spot, ChatbotQuery
from django.utils import timezone

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ['admin_id', 'admin_name', 'admin_email', 'password']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class ChatbotQuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatbotQuery
        fields = '__all__'


class RentalLotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rental_lot
        fields = '__all__'


class RentalSpotSerializer(serializers.ModelSerializer):
    lot = RentalLotSerializer(read_only=True)
    class Meta:
        model = Rental_spot
        fields = '__all__'



class RegisteredSpotSerializer(serializers.ModelSerializer):
    # this will display related foreign key data (optional)
    lot = RentalLotSerializer(read_only=True)
    spot = RentalSpotSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Registered_spot
        fields = '__all__'

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def validate_user_email(self, value):
        # Ensure email is unique
        if User.objects.filter(user_email=value).exists():
            raise serializers.ValidationError("Email already registered !!!")
        return value

    def validate_password(self, value):
        # Optional: enforce at least one uppercase, number, special char
        upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        numbers = '1234567890'
        special = '@_!#$%^&*()_+{|}?/.><,:;~`='
        lower = 'abcdefghijklmnopqrstuvwxyz'
        if not any(c in upper for c in value):
            raise serializers.ValidationError("Password must contain uppercase")
        if not any(c in numbers for c in value):
            raise serializers.ValidationError("Password must contain a number")
        if not any(c in special for c in value):
            raise serializers.ValidationError("Password must contain special char")
        if not any(c in lower for c in value):
            raise serializers.ValidationError("Password must contain lowercase")
        return value
    
class UpdateAdminSerializer(serializers.ModelSerializer):

    class Meta:
        model = Admin
        fields = ['admin_id', 'admin_name', 'admin_email', 'password']

    def validate_password(self, value):
        upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        numbers = '1234567890'
        special = '@_!#$%^&*()_+{|}?/.><,:;~`='
        lower = 'abcdefghijklmnopqrstuvwxyz'
        if not any(c in upper for c in value):
            raise serializers.ValidationError("Password must contain uppercase")
        if not any(c in numbers for c in value):
            raise serializers.ValidationError("Password must contain a number")
        if not any(c in special for c in value):
            raise serializers.ValidationError("Password must contain special char")
        if not any(c in lower for c in value):
            raise serializers.ValidationError("Password must contain lowercase")
        return value
    
def serialize_lot(lot):
    spots_qs = lot.rental_spot_set.all()
    total = spots_qs.count()
    available = spots_qs.filter(status='A').count()
    occupied = spots_qs.filter(status='O').count()

    registered = Registered_spot.objects.filter(lot=lot)
    total_days = 0
    total_cost = 0
    for reg in registered:
        start = reg.registered_time
        end = reg.leaving_time if reg.leaving_time else timezone.now()
        days = (end - start).days
        total_days += days
        total_cost += (reg.spot.price / 30) * days

    spots_data = [
        {
            "spot_id": s.spot_id,
            "address": s.address,
            "type": s.type,
            "price": s.price,
            "status": s.status,
        }
        for s in spots_qs
    ]

    return {
        "lot_id": lot.lot_id,
        "location": lot.location,
        "pincode": lot.pincode,
        "total_spots": total,
        "available_spots": available,
        "occupied_spots": occupied,
        "spots": spots_data,
    }