from rest_framework import viewsets
from .models import Video
from .serializers import VideoSerializer

import torch
import cv2

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer

    #Process each new video that is uploaded with a POST
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if response.status_code == 201:
            video_instance = Video.objects.get(pk=response.data['id'])
            print(f"Processing uploaded video: {video_instance.video.path}")
            model = torch.hub.load('ultralytics/yolov5', 'yolov5s')
            video = cv2.VideoCapture(video_instance.video.path)
            while video.isOpened():
                ret, frame = video.read()
                if ret:
                    detections = model(frame)
                    print(detections)
        return response