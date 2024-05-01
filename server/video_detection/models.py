from django.db import models

class Video(models.Model):
    file_name = models.CharField(max_length=100)
    video = models.FileField(upload_to='videos/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
