# Generated by Django 4.1.2 on 2023-01-31 07:42

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='StoreCornerCordsData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('buildingName', models.CharField(max_length=100)),
                ('cornerCords', models.JSONField()),
            ],
            options={
                'db_table': 'GPS_CORNER_CORD',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='StoreGPSData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('gpsCord', models.JSONField()),
            ],
            options={
                'db_table': 'GPS_DATA',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='StoreNodeData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('buildingName', models.CharField(max_length=100)),
                ('floorName', models.CharField(max_length=100)),
                ('nodes', models.JSONField()),
            ],
            options={
                'db_table': 'NODE_DATA',
                'managed': True,
            },
        ),
    ]
