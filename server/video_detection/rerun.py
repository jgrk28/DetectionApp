import rerun as rr
import cv2

from decouple import config

from .influx import InfluxDB

def display_video(video):
    rr.disconnect()
    rr.init("object_detection_rerun")
    rr.serve(open_browser=False, web_port=int(config('RR_WEBPORT')), ws_port=int(config('RR_WSPORT')))

    print(f"Displaying rerun for: {video.video.path}")
    cvVideo = cv2.VideoCapture(video.video.path)

    fps = cvVideo.get(cv2.CAP_PROP_FPS)
    ns_per_frame = int(1_000_000_000 / fps)

    # Query each field seperately so that we can assign them without checking the field
    # Query and group by time which will give one table per frame
    # alternative would be to call a query each frame to get the boxes at that time but would require many more database hits
    influx = InfluxDB()
    x_data = influx.query(f"""
        |> range(start: 0)
        |> filter(fn: (r) => r._measurement == "bbox")
        |> filter(fn: (r) => r.videoId == "{video.id}")
        |> filter(fn: (r) => r._field == "x")
        |> group(columns: ["_time"])
    """)
    y_data = influx.query(f"""
        |> range(start: 0)
        |> filter(fn: (r) => r._measurement == "bbox")
        |> filter(fn: (r) => r.videoId == "{video.id}")
        |> filter(fn: (r) => r._field == "y")
        |> group(columns: ["_time"])
    """)
    width_data = influx.query(f"""
        |> range(start: 0)
        |> filter(fn: (r) => r._measurement == "bbox")
        |> filter(fn: (r) => r.videoId == "{video.id}")
        |> filter(fn: (r) => r._field == "width")
        |> group(columns: ["_time"])
    """)
    height_data = influx.query(f"""
        |> range(start: 0)
        |> filter(fn: (r) => r._measurement == "bbox")
        |> filter(fn: (r) => r.videoId == "{video.id}")
        |> filter(fn: (r) => r._field == "height")
        |> group(columns: ["_time"])
    """)

    frame_count = 0

    # Read frames one at a time until video ends
    while cvVideo.isOpened():
        ret, frame = cvVideo.read()
        if ret:
            rr.set_time_nanos("timestamp", frame_count*ns_per_frame)

            byte_string = cv2.imencode('.jpg', frame)[1].tostring()
            rerun_image = rr.ImageEncoded(contents=byte_string)
            rr.log("image", rerun_image)

            # Each box needs a unique name
            prediction_number = 0
            
            # Loop through all tables simultaniously as they have same number of records
            for (x_record, y_record, w_record, h_record) in zip(x_data[frame_count], y_data[frame_count], width_data[frame_count], height_data[frame_count]):
                x = x_record.get_value()
                y = y_record.get_value()
                w = w_record.get_value()
                h = h_record.get_value()
                rr.log(f"box{prediction_number}", rr.Boxes2D(centers=[x, y], sizes=[w, h]))
                prediction_number += 1
            frame_count += 1
        else:
            break

    return True
