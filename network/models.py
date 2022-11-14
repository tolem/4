from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db import models


class User(AbstractUser):
    def __str__(self):
        return f'{self.username}'


class Following(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followed", null=False)
    followers = models.ManyToManyField(User, blank=True, related_name="followings")



    # def clean(self):
    #     if self.user and self.followers:
    #         if self.followers.count() >= 1:
    #             if self.followers.filter(username=self.user.username):
    #                 raise ValidationError({'user': (f'{self.user.username}, a user cannot follow themself') },code='error1')


    def __str__(self):
        num = sum([True for n in self.followers.all()])
        follow = [name for name in self.followers.all()]
        return f'{self.user} has {num} followers they are: {follow}'

    def __repr__(self):
        num = int(sum([True for n in self.followers.all()]))
        return f' {num} followers'

class UserPost(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="userposts", null=False)
    content = models.TextField(verbose_name="Post", default="", max_length=2048, null=False)
    timestamps = models.DateTimeField(auto_now_add=True)
    # like = models.BooleanField(default=False)
    # likes =  models.IntegerField(default=0)
    user_likes = models.ManyToManyField("User", related_name="liked_posts", null=True)



    def clean(self):
        pass

    def serialize(self):
        return {
            "id": self.id,
            "author": self.author.username,
            "content": self.content,
            "timestamps": self.timestamps.strftime("%b %d %Y, %I:%M %p"),
            "user_likes": self.user_likes.all().count(),
         
        }

    def __str__(self):
        return f'{self.author} created post on  {self.timestamps}'


