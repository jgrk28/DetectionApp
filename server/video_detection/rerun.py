import rerun as rr
import cv2

from decouple import config

def display_video(video):
    rr.disconnect()
    rr.init("object_detection_rerun")
    rr.serve(open_browser=False, web_port=int(config('RR_WEBPORT')), ws_port=int(config('RR_WSPORT')))

    print(f"Displaying rerun for: {video.video.path}")
    video = cv2.VideoCapture(video.video.path)

    # Read frames one at a time until video ends
    while video.isOpened():
        ret, frame = video.read()
        if ret:
            byte_string = cv2.imencode('.jpg', frame)[1].tostring()
            rerun_image = rr.ImageEncoded(contents=byte_string)
            rr.log("image", rerun_image)
        else:
            break

    return True
