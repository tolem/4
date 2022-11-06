
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("followers", views.user_following, name="following"),
    path("profile", views.user_profile, name="profile"),

          # API Routes
    # path("posts", views.posts, name="posts"),


]
