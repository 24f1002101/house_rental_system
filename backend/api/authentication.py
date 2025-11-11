from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from house.models import User, Admin # Make sure to import your models

class CustomJWTAuthentication(JWTAuthentication):
    """
    Custom authentication class to handle separate User and Admin models.
    """
    def get_user(self, validated_token):
        """
        Attempts to find and return a user using the given validated token.
        """
        try:
            # We stored the primary key and role in the token's payload
            user_id = validated_token.get('user_id')
            role = validated_token.get('role')

            if user_id is None or role is None:
                raise InvalidToken("Token is missing user_id or role claim")

            # Look up the user based on the role provided in the token
            if role == 'user':
                user = User.objects.get(user_id=user_id)
            elif role == 'admin':
                user = Admin.objects.get(admin_id=user_id)
            else:
                raise AuthenticationFailed("Invalid role specified in token", code='role_not_found')

        except (User.DoesNotExist, Admin.DoesNotExist):
            raise AuthenticationFailed("User not found for the given token", code='user_not_found')
        except Exception as e:
            # Catch any other unexpected errors
            raise AuthenticationFailed(f"An error occurred during authentication: {e}")

        return user