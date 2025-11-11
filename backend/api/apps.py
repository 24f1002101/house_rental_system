from django.apps import AppConfig

<<<<<<< HEAD
class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        import api.social_patch  # this disables redirect_to_signup
=======

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
>>>>>>> 52757e176c76c3d46b6dc8ee6f8034bff86425a2
