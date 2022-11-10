from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
from .models import User, UserPost, Following
from .forms import *
import json
from django.views.decorators.csrf import csrf_exempt
from itertools import chain



def index(request):
    _users = User.objects.all()
    postform = UserPost.objects.all()
    print(postform, _users)
    # double check to make sure its an instance of same user
    return render(request, "network/index.html",)


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        print(user)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


@csrf_exempt
@login_required
def commit_posts(request):
    # Composing a new post must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    # gets content from posts
    data = json.loads(request.body)
    content = data.get("message", "")
    try:
        _user = request.user
        post = UserPost(
                author=_user,
                content=content,
                )
        post.save()
    except IntegrityError:
        return JsonResponse({'message: intergrity error raised check to see your are logged in'})

    print('post is sent, Lami')
    return JsonResponse({"message": "Email sent successfully."}, status=201)



def show_posts(request):
    # Filter emails returned based on mailbox
 
    posts = UserPost.objects.all()
    if posts:
        pass

    # elif userpost.lower() == "following":
    #     _user = User.objects.get(pk=request.user.pk)
    #     # followings = _user.followings.all()
    #     # _followed = _user.followed.all()
    #     # for f in followings:
    #     #     print(f.user)
    #     # print(followings, 'followeds')
    #     # print(_followed, 'followers')
    #     # pts = UserPost.objects.all()
    #     # for u in pts:
    #     #     print(u.author.userposts)
    #     # print(pts)
    #     return JsonResponse(_user.posts, safe=False)
    
    #     # return HttpResponse(followings)
    else:
        return JsonResponse({"error": "Invalid posts."}, status=400)

    # Return posts in reverse chronologial order
    posts = posts.order_by("-timestamps").all()
    # print([post.serialize() for post in posts])
    return JsonResponse([post.serialize() for post in posts], safe=False)



@login_required
def show_followings(request):
    _user = request.user

    followed = _user.followings.all()
    followings_list = set()

    for follow in followed:
        print(follow.user, follow.user.userposts.all())
        if follow is not None:
            followings_list.add(follow.user.userposts.all())

    # print("followings:",request.user.userposts.all())
    print(followings_list)
    followings_list = list(chain(followings_list))
    print(followings_list)

    return HttpResponse(request.user)


@login_required
def user_profile(request):
    return render(request, 'network/profile.html')