# house/urls.py

from django.urls import path
from . import auth
from . import admin_func
from . import user_func
#from . import accounts
urlpatterns =[
    path('api/role', auth.role, name='role'),
    path('api/user_login', auth.user_index, name='user_index'), # Renamed for clarity
    path('api/user_registration', auth.user_register, name='registration'),
    path('api/admin_login', auth.index, name='index'),
    path('api/admin_homepage', auth.admin_homepage, name='admin_homepage'),
    path('api/user_homepage/<int:user_id>', auth.user_homepage, name='user_homepage'),
    path('api/registered_users', admin_func.registered_users, name='registered_users'),
    path('api/update_admin_profile', admin_func.admin_profile, name='admin_profile'),
    path('api/add_spot/<int:lot_id>', admin_func.add_spot, name='add_spot'),
    path('api/add_lot', admin_func.add_lot, name='add_lot'),
    path('api/expand_lot/<int:lot_id>', admin_func.expand_lot, name='expand_lot'),
    path('api/delete_lot/<int:lot_id>', admin_func.delete_lot, name='delete_lot'),
    path('api/edit_spot/<int:lot_id>/<int:spot_id>', admin_func.edit_spot, name='edit_spot'),
    path('api/view_spot/<int:lot_id>/<int:spot_id>', admin_func.view_spot, name='view_spot'),
    path('api/delete_spot/<int:lot_id>/<int:spot_id>', admin_func.delete_spot, name='delete_spot'),
    path('api/summary', admin_func.summary, name='summary'),
    path('api/user_profile/<int:user_id>', user_func.user_profile, name='user_profile'),
    path('api/book_spot/<int:lot_id>/<int:spot_id>/<int:user_id>', user_func.book_spot, name='book_spot'),
    path('api/user_history/<int:user_id>', user_func.user_history, name='user_history'),
    path('api/user_summary/<int:user_id>', user_func.user_summary, name='user_summary'),
    path('api/release_spot/<int:lot_id>/<int:spot_id>/<int:user_id>', user_func.release_spot, name='release_spot'),
    path('api/admin_search', admin_func.admin_search, name='admin_search')
]