
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile", views.user_profile, name="profile"),
    path("profile/<str:profile_name>", views.user_profile, name="profile_id"),

          # API Routes
    path("posts", views.commit_posts, name="posts"),
    path("posts/all/<str:endpoint>", views.show_posts, name="userpost"),
    path("posts/following/<str:endpoint>", views.show_followings, name="following"),
    path("posts/<int:post_id>", views.update_post, name="post_id"),
    path("user", views.get_user, name="user_info"),
    path("follow/<str:username>", views.follow, name="follow"),
    path("profilepost/<str:username>/<str:endpoint>", views.profile_update, name="update"),


    # path("tweets/<str:endpoint>", views.posts, name="posts")


]
