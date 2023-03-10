# Generated by Django 4.1.3 on 2022-11-19 01:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('studios', '0004_alter_studio_address_alter_studio_latitude_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='studio',
            name='latitude',
            field=models.DecimalField(blank=True, decimal_places=6, help_text='Latitude of studio (-90 to 90)', max_digits=9, null=True),
        ),
        migrations.AlterField(
            model_name='studio',
            name='longitude',
            field=models.DecimalField(blank=True, decimal_places=6, help_text='Longitude of studio (-180 to 180)', max_digits=9, null=True),
        ),
    ]
