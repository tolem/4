# forms.py
from django import forms
from .models import *

# class Posts(forms.ModelForm):
# 	class Meta:
#         model = UserPost
#         fields = ('author', 'likes', 'like', 'content')

#         widgets = {'content': forms.TextInput(attrs={'class':"form-control"})}

class Posts(forms.ModelForm):
    class Meta:
        model = UserPost
        fields = ('author', 'user_likes', 'content') 

        widgets = { 
                'content': forms.Textarea(attrs={'class':"form-control ml-1 shadow-none textarea", 'placeholder':"post your thought"}),
                }
