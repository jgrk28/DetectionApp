import rerun as rr
import cv2

def display_video(video):
    rr.init("object_detection_rerun")
    rr.serve(open_browser=False)

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
