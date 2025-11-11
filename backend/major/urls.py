from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView
from api.auth import custom_token_refresh

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('api.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', custom_token_refresh, name='custom_token_refresh'),
]
