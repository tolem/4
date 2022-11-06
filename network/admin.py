from django.contrib import admin

# Register your models here.
from network.models import User, UserPost, Following

admin.site.register(User)
admin.site.register(UserPost)
admin.site.register(Following)