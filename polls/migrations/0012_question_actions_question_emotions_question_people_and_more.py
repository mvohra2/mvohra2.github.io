# Generated by Django 4.2.11 on 2024-04-17 17:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0011_alter_question_pub_date_alter_question_response_text'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='actions',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='question',
            name='emotions',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='question',
            name='people',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AlterField(
            model_name='question',
            name='response_text',
            field=models.TextField(default='No response'),
            preserve_default=False,
        ),
    ]