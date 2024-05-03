# Video Object Detection React App

This project is a react app in which the user can upload videos. These videos will then be processed with [YOLOv5](https://github.com/ultralytics/yolov5) and the object detections will be stored in an [influxDB](https://www.influxdata.com/) database. The videos themselves and backend API is managed with django. The user can then view their video with the detections overlayed as well as view older videos that they processed. The video display is done with [rerun](https://www.rerun.io/).

## Get Started

You must first create a local influxDB database, you can find a guide [here](https://docs.influxdata.com/influxdb/v2/get-started/).

Then you can clone this repository and set up the server and the client respectively.

To set up the django server first navigate to the server directory. You'll then need to create a `.env` file based on the `example.env` provided. Put in the information that you created when making the influxDB database. `RR_WEBPORT` and `RR_WSPORT` just need to be consistant accross the client and server. Next create a python virtual environment and install the required packages with 
```
python -m pip install -r requirements.txt
``` 
finally start the server by running 
```
python manage.py runserver
```

To set up the node client first navigate to the client directory. You'll then need to create a `.env` file based on the `example.env` provided. If you are just running locally you can set the hosts to `localhost`, the django api will default to port `8000`. Next install the required packages with 
```
npm install
``` 
and finally start the client by running 
```
npm start
```

## InfluxDB Database Structure

InfluxDB is a database designed specifically for time series data. The assumed use case is something like sensor output that are logged in real time. It makes deleting old data, down-sampling, and aggregating over time efficient. While our use case is slightly different we are still working with time series data so to make use of those benefits down the road we should store our data in a time series.

Because of this, I chose to log each detection at the time that frame appeared in relation to the start of the video. Because InfluxDB uses epoch time this essentially makes us assume each video starts at 1970-01-01 00:00:00.000000. While we don't end up needing the more advanced features of InfluxDB, this structure would allow us to do things like only update the bounding boxes every 5 frames, or every 3 seconds.

## Rerun Data Visualization

Rerun allows us to log detections and other data and play/pause/scrub through them to visualize. This is useful for displaying our boxes on top of the video and allowing the user to control the video with the boxes staying in sync.

I could not get the React [package](https://www.npmjs.com/package/@rerun-io/web-viewer-react) to work properly so I had to embed it simply using an `iframe`. It would be worthwile to try to get the React package working as it allows more control over what the viewer looks like in the app.

## Django API

While InfluxDB is good at handling time series data it is not meant to store large binary data blobs like video files. I decided to use Django for it's quick REST API setup and integrated data storage. Django would let me easily expand the backend to have more functionalily in the future.

Currently I am just saving the video files locally on the server but if this app were to scale I would definitely want to set up a cloud storage service like s3 to store the video files.

## Further Work

While I made the login and signup pages with their respective API calls, I did not have time to finish the authentication implementation. The next steps would be getting django to send a session cookie to the frontend when a user signs up or logs in. This cookie would be used to authenticate subsequent API calls so that only users can access the video APIs. I would use PermissionClasses on the backend to restrict which views needed a session cookie. On the frontend, I would also add a state (using createContext) authentication that restrict access to to "/" and "/view" urls. Anytime those views are accessed without a cookie, the user would be redirected to the login page.

I could also add a progress bar when the video is being processed. This would require a websocket to send information from the backend to the frontend as the video is being processed.