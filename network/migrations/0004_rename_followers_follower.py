# Generated by Django 4.1.2 on 2022-10-30 21:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0003_userpost_description_userpost_likes_and_more'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Followers',
            new_name='Follower',
        ),
    ]
