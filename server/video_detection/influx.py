from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS
from decouple import config

class InfluxDB():
  def __init__(self, bucket=config('INFLUXDB_BUCKET')):
    self.token = config('INFLUXDB_TOKEN')
    self.org = config('INFLUXDB_ORG')
    self.url = config('INFLUXDB_URL')
    self.bucket = bucket
    self.client = InfluxDBClient(url=self.url, token=self.token, org=self.org)

  def write(self, point):
    write_api = self.client.write_api(write_options=SYNCHRONOUS)
    write_api.write(bucket=self.bucket, org=self.org, record=point)

  def query(self, query_string):
    query_api = self.client.query_api()
    return query_api.query(query_string, org=self.org)
  
  def write_bbox(self, videoId, object_class, x, y, w, h, confidence, time):
    point = (
      Point("bbox")
      .tag("videoId", videoId)
      .tag("class", object_class)
      .field("x", x)
      .field("y", y)
      .field("width", w)
      .field("height", h)
      .field("confidence", confidence)
      .time(time)
    )
    self.write(point)

  def write_torch_results(self, videoId, results, class_names, time):
      # Predictions for the first (and only) given image in x, y, width, height format
      # Predictions take the form of [x, y, w, h, confidence, classId]
      for prediction in results.xywh[0]:
        self.write_bbox(
          videoId, 
          class_names[int(prediction[5])], 
          int(prediction[0]), 
          int(prediction[1]), 
          int(prediction[2]), 
          int(prediction[3]),
          float(prediction[4]),
          time)
