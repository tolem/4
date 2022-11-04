# forms.py
from django import forms
from .models import *



class PostForm(forms.ModelForm):
	class Meta:
        model = UserPost
        exclude = ('author', 'likes', 'like',
    )
	widgets = {
            'title': forms.TextInput(attrs={'class':"form-control", 'placeholder':"title"}),
            'content': forms.TextInput(attrs={'class':"form-control"}),
            'starting_bid': forms.TextInput(attrs={'class':"form-control", 'placeholder':"price"}),
        }

