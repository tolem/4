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
from django.core.paginator import Paginator



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



def show_posts(request, endpoint):
    # Filter post returned based on endpoint
 
    posts = UserPost.objects.all()
    if posts:
            # Return posts in reverse chronologial order
        posts = posts.order_by("-timestamps").all()
        paginator = Paginator(posts, 10)
        counter = int(request.GET.get("page") or 1)
        print(paginator)


    else:
        return JsonResponse({"error": "Invalid posts."}, status=400)
        
    if endpoint == "posts":
        page = paginator.page(counter)
        set_posts = page.object_list

        return JsonResponse([post.serialize() for post in set_posts], safe=False)

    elif endpoint == "pages":
        return JsonResponse({"pages": paginator.num_pages})

    else:
        return HttpResponse(status=404)



@login_required
def show_followings(request, endpoint):
    try:
        _user = request.user
        print(_user)
        followed = _user.followings.all()
        followings_list = set()
        print(followed)

        for follow in followed:
            print(follow, len(follow.user.userposts.all()), 'c')
            # print(follow.user, follow.user.userposts.all())
            if len(follow.user.userposts.all()) > 0:
                # print(len(follow.user.userposts.all()))
                followings_list.add(follow.user.userposts.all())
            else:
                followings_list.add(follow.user.userposts.all())

        sortedlist = list(followings_list.copy())
        print(sortedlist)
        if sortedlist:
            sortedusers =  sortedlist[0]
            print(type(sortedusers))
            sortedusers = sortedusers.union(*sortedlist).order_by("-timestamps").all()
            print(sortedusers)
            paginator = Paginator(sortedusers, 10)
            counter = int(request.GET.get("page") or 1)
            if endpoint == "posts":
                page = paginator.page(counter)
                set_posts = page.object_list
                return JsonResponse([post.serialize() for post in set_posts], safe=False)

            elif endpoint == "pages":
                return JsonResponse({"pages": paginator.num_pages})

            else:
                return HttpResponse(status=404)

        return JsonResponse({"error": "No posts yet."}, status=400)

    except User.DoesNotExist:
        return HttpResponseBadRequest("Bad Request: user does not exist")


def user_profile(request, profile_name):
    profiler = User.objects.get(username=profile_name)
    print(User._meta.get_fields())
    profile_posts = profiler.userposts.all()
    profile_posts = profile_posts.order_by("-timestamps").all()
    profile_posts = [post.serialize() for post in profile_posts]
    followed = profiler.followed.all()
    followers = profiler.followings.all()

    num_followed = Following.objects.all().filter(followers=profiler.pk)

    # print(bool(followed))
    # print(Following._meta.get_fields())

    num_followers = sum([True for name in followers])
    paginator = Paginator(profile_posts, 10) # Show 10 post per page.
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    print(page_obj.has_next())
    return render(request, 'network/profile.html', {
        'profile_users' : profiler, 
        'posts': page_obj,
        'followers': list(str(followed).split(' '))[2] if followed else "0",
        'followed': num_followers,
        'liked_tweets': profiler.liked_posts.all().count(),
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



@csrf_exempt
@login_required
def update_post(request, post_id):
    # Query for requested users
    try:
        post = UserPost.objects.get(pk=post_id)
    except UserPost.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)

    # Return post contents
    if request.method == "GET":
        return JsonResponse(post.serialize())

    # Update whether post is updated or is liked
    elif request.method == "PUT":
        data = json.loads(request.body)
        if data.get("liked") is not None:
            # print(post.author.liked_posts.all(), post.user_likes.all())
            if post.author.pk != request.user.pk:
                print("???", post.user_likes.all())
                post.user_likes.add(request.user)
                post.save()
            else:
                print('user cannot like own posts')
            # post.likes = data["like"]
        if data.get("content") is not None:
            print("msg")
            post.content = data["content"]
        post.save()
        return HttpResponse(status=204)


    elif request.method == "DELETE":
        # data = json.load(request.body)
        # if data.get("liked") is not None:
        post.user_likes.remove(request.user)
        post.save()
        return HttpResponse(status=204)


    # Post must be via GET or PUT or DELETE
    else:
        return JsonResponse({
            "error": "GET or PUT or DELETE request required."
        }, status=400)


@csrf_exempt
def follow(request, username):
    # Query for requested user
    try:
        print(username)
        _user = User.objects.get(username=username)
        if _user.followed.count() == 0:
            follow = Following.objects.create(user=_user)
            follow.followers.set([follow_user]) 
            follow.save()
            _followigs = follow

        else:
            _followigs =  Following.objects.get(user=_user)


        follow_user = User.objects.get(pk=request.user.pk)

        if request.method == 'PUT':
            print(username)
            data = json.loads(request.body)
            if data.get('follow') is not None:
                if _user is not None and _user.pk != request.user.pk:
                    print("jello")              
                    # if user not in following table, we create new instance
                    if _user.followed.count() == 0:
                        follow = Following.objects.create(user=_user)
                        follow.followers.set([follow_user]) 
                        follow.save()
                    else:
                        print(follow_user)
                        print(_user.followings.all())
                        _followigs.followers.add(follow_user) # we add current user to followers
                  
                        print(follow_user)
                        _user.save() # we save it 
                        print(_user.followings.all())
                    return HttpResponse(status=204)


       
        elif request.method == "DELETE":
            data = json.loads(request.body)
            if data.get('Unfollow') is not None and _user.pk != request.user.pk:
                _followigs.followers.remove(follow_user) # we remove current user to followers
                print(_user.followings.all()) 
                _user.save() #  save table 
                return HttpResponse(status=204)



        if request.method == "GET":
            return JsonResponse({"user":_user.username, "followers": list(str(_user.followed.all()).split(' '))[2] if _user.followed.all() else "0",}, safe=False)



    except UserPost.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)



def profile_update(request, username, endpoint):
    profiler = User.objects.get(username=username)
    print(User._meta.get_fields())
    profile_posts = profiler.userposts.all()
    profile_posts = profile_posts.order_by("-timestamps").all()
    profile_posts = [post.serialize() for post in profile_posts]
    followed = profiler.followed.all()
    followers = profiler.followings.all()
    num_followed = Following.objects.all().filter(followers=profiler.pk)


    num_followers = sum([True for name in followers])
    paginator = Paginator(profile_posts, 10) # Show 10 post per page.
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    counter = int(request.GET.get("page") or 1)


    print(page_obj.has_next())

    if endpoint == "post":
        page = paginator.page(counter)
        set_posts = page.object_list
        print(set_posts)
        set_posts = [post for post in set_posts]
        return JsonResponse(set_posts, safe=False)

    elif endpoint == "pages":
        return JsonResponse({"pages": paginator.num_pages})

    else:
        return HttpResponse(status=404)










