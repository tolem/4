from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Following(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user", null=False)
    follower = models.ManyToManyField(User, blank=True, related_name="follower")

    def __str__(self):
     
        return f'{self.user}'


class UserPost(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="author", null=False)
    content = models.TextField(verbose_name="Post", default="", max_length=2048, null=False)
    timestamps = models.DateTimeField(auto_now_add=True)
    like = models.BooleanField(default=False)
    likes =  models.IntegerField(default=0)

    def clean(self):
        pass

    def __str__(self):
        return self.author
