
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile", views.user_profile, name="profile"),

          # API Routes
    path("posts", views.commit_posts, name="posts"),
    path("posts/all", views.show_posts, name="userpost"),
    path("posts/following", views.show_followings, name="following"),

]
