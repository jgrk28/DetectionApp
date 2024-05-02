import React, { useState, useEffect } from 'react';

function VideoViewer() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState('');

  useEffect(() => {
    fetch(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/videos/`)
      .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); 
      })
      .then((data) => {
        setVideos(data);
        setSelectedVideo(data[0]?.id);
      })
      .catch((error) => {
        console.error('Failed to fetch videos:', error);
      })
  }, []);

  useEffect(() => {
    if (selectedVideo) {
      fetch(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/videos/${selectedVideo}/display-video/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .catch((error) => {
        console.error('Failed to display video:', error);
      })
    }
  }, [selectedVideo]);

  return (
    <div>
      <h1>Video Viewer</h1>
      <select onChange={(e) => setSelectedVideo(e.target.value)} value={selectedVideo}>
        {videos.map((video, index) => (
          <option key={index} value={video.id}>
            {video.file_name}
          </option>
        ))}
      </select>
      {selectedVideo && 
      <iframe 
        title="Rerun Web Viewer" 
        width={1000} 
        height={600} 
        src={`http://${process.env.REACT_APP_RR_HOST}:${process.env.REACT_APP_RR_WEBPORT}/?url=ws://${process.env.REACT_APP_RR_HOST}:${process.env.REACT_APP_RR_WSPORT}`}
        />
      }
    </div>
  );
}

export default VideoViewer;