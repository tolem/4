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
from django.views.generic import ListView



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
    print(posts)
    # print([post.serialize() for post in posts])
    return JsonResponse([post.serialize() for post in posts], safe=False)



@login_required
def show_followings(request):
    try:
        _user = request.user
        followed = _user.followings.all()
        followings_list = set()

        for follow in followed:
            # print(follow.user, follow.user.userposts.all())
            if len(follow.user.userposts.all()) > 0:
                # print(len(follow.user.userposts.all()))
                followings_list.add(follow.user.userposts.all())

        sortedlist = list(followings_list.copy())
        sortedusers =  sortedlist[0]
        sortedusers = sortedusers.union(*sortedlist).order_by("-timestamps").all()
        print(sortedusers)
        return JsonResponse([post.serialize() for post in sortedusers], safe=False)

    except User.DoesNotExist:
        return HttpResponseBadRequest("Bad Request: user does not exist")


def user_profile(request, profile_name):
    profiler = User.objects.get(username=profile_name)
    profile_posts = profiler.userposts.all()
    profile_posts = profile_posts.order_by("-timestamps").all()
    profile_posts = [post.serialize() for post in profile_posts]
    # followed = profiler.followed.all()
    # followers = profiler.followings.all()
    # print(followers)
    # num_followed = sum([True for n in followed])
    # num_followers = sum([True for name in followers])
    # print(followers, followers.count())
    # print(num_followers, num_followed, followed, num_followed)

    # for f in followers:
    #     print(f.user.userposts.all(), 'posts')
    # print(followed, followers, profile_posts)
    return render(request, 'network/profile.html', {
        'profile_users' : profiler, 
        'posts': profile_posts,
        'followers': num_followed,
        # 'followed': num_followers,


        })


def get_user(request):
    try:
        if request.user.pk is not None:
            return JsonResponse({'id': request.user.pk, 'user': request.user.username.lower()}, safe=False)
        return JsonResponse({"message": "Bad Request: user does not exist."}, status=201, safe=False)

    except User.DoesNotExist:
        return HttpResponseRedirect(reverse("index"))


def show_profile():
    pass
