from django.urls import path
from . import auth
from . import admin_func
from . import user_func
urlpatterns =[
path('',auth.role,name='role'),
path('admin_dashboard',auth.index,name='index'),
path('user_dashboard',auth.user_index,name='user_index'),
path('user_registration',auth.user_register,name='registration'),
path('users_used',admin_func.registered_users,name='registered'),
path('admin_edit',admin_func.admin_profile,name='edit_admin'),
path('admin_homepage',auth.admin_homepage,name='admin_homepage'),
path('admin_logout',admin_func.admin_logout,name='logout_admin'),
path('spot_addition/<int:lot_id>',admin_func.adding_spot,name='add_spot'),
path('adding_lot',admin_func.addlot,name='adding_lot'),
path('expand/<int:lot_id>',admin_func.expand_lot,name='expand_lot'),
path('delete_lot/<int:lot_id>',admin_func.delete_lot,name='delete_lot'),
path('edit_spot/<int:lot_id>/<int:spot_id>',admin_func.edit_spot,name='edit_spot'),
path('user_homepage/<int:user_id>',auth.user_homepage,name='user_homepage'),
path('edit_profile/<int:user_id>',user_func.edit_profile,name='edit_profile'),
path('user_logout/<int:user_id>',user_func.user_logout,name='user_logout'),
path('book_spot/<int:lot_id>/<int:spot_id>/<int:user_id>',user_func.book_spot,name='book_spot'),
path('user_history/<int:user_id>',user_func.user_history,name='user_history'),
path('release_spot/<int:lot_id>/<int:spot_id>/<int:user_id>',user_func.release_spot,name='release_spot'),
path('user_summary/<int:user_id>',user_func.user_summary,name='user_summary'),
path('view_spot/<int:lot_id>/<int:spot_id>',admin_func.view_spot,name='view_spot'),
path('delete_spot/<int:lot_id>/<int:spot_id>',admin_func.delete_spot,name='del_spot'),
path('admin_search',admin_func.admin_search,name='admin_search'),
path('summary',admin_func.summary,name='summary')
]