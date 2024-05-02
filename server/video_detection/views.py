from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from .models import Video
from .serializers import VideoSerializer
from .influx import InfluxDB
from .rerun import display_video

import torch
import cv2

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer

    #Process each new video that is uploaded with a POST
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if response.status_code == 201:
            videoId = response.data['id']
            video_instance = Video.objects.get(pk=videoId)
            print(f"Processing uploaded video: {video_instance.video.path}")
            model = torch.hub.load('ultralytics/yolov5', 'yolov5s')
            video = cv2.VideoCapture(video_instance.video.path)
            
            influx = InfluxDB()

            time_elapsed = 0
            fps = video.get(cv2.CAP_PROP_FPS)
            ns_per_frame = int(1_000_000_000 / fps)

            #Read frames one at a time until video ends
            while video.isOpened():
                ret, frame = video.read()
                if ret:
                    detections = model(frame)
                    influx.write_torch_results(videoId, detections, model.model.names, time_elapsed)
                    time_elapsed += ns_per_frame
                    print(detections)
        return response
    
    # Add a custom endpoint to videos REST API to display the video using rerun
    # This endpoint will be called using POST to /videos/<videoId>/display-video/
    @action(detail=True, methods=['post'], url_path='display-video')
    def process_video(self, request, pk=None):
        """
        Custom action to trigger processing on a specific video.
        """
        video = self.get_object()
        try: 
            display_video(video)
        except Exception as e:  # Better to catch specific exceptions
            print(f"Failed to display video: {str(e)}")
            return Response({'error': 'failed to display selected video'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'status': 'displaying video'}, status=status.HTTP_200_OK)
