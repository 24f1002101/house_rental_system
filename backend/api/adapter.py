# api/adapter.py

from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from house.models import User # Import your custom User model

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):

    def save_user(self, request, sociallogin, form=None):
        """
        This method is called when a social user is saved to the database.
        We override it to create a user in our custom 'User' table.
        """
        user_data = sociallogin.user
        email = user_data.email
        name = user_data.first_name + ' ' + user_data.last_name

        # Check if a user with this email already exists in your custom User table
        try:
            existing_user = User.objects.get(user_email=email)
            sociallogin.user = existing_user # Link social account to existing user
        except User.DoesNotExist:
            # If user does not exist, create a new one
            # Note: This creates a user without a password, as they will only log in via Google.
            # You can add a placeholder password or generate a random one if your model requires it.
            new_user = User.objects.create(
                user_email=email,
                name=name,
                # Add default values for other required fields if any
                address='',
                pincode=0,
                status='A', 
                password= '' # Set a non-usable password
            )
            sociallogin.user = new_user

        # Now, call the parent method to complete the social login process
        super().save_user(request, sociallogin, form)
        return sociallogin.user