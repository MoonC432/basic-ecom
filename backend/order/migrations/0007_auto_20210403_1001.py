# Generated by Django 3.1.6 on 2021-04-03 04:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0006_auto_20210321_2209'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='order',
            options={'ordering': ['-date_of_entry', '-paid']},
        ),
    ]