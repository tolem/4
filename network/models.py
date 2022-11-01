from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Follower(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user", null=False)
    follower = models.ManyToManyField(User, blank=True, related_name="follower")

    def __str__(self):
        return self.user


class UserPost(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="author", null=False)
    title = models.CharField(max_length=128, default=None)
    description = models.TextField(verbose_name="Post", default="", max_length=2048, null=False)
    timestamps = models.DateTimeField(auto_now_add=True)
    likes =  models.IntegerField(default=0)

    def __str__(self):
        return self.author
