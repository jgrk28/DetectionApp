import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function VideoViewer() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState('');
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);

  const navigate = useNavigate();

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
        setSelectedVideo(data.at(-1)?.id);
      })
      .catch((error) => {
        console.error('Failed to fetch videos:', error);
      })
  }, []);

  useEffect(() => {
    if (selectedVideo) {
      setLoading(true);
      fetch(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/videos/${selectedVideo}/display-video/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(() => {
        setLoading(false);
        setKey(prevKey => prevKey + 1)
      })
      .catch((error) => {
        setLoading(false);
        console.error('Failed to display video:', error);
      })
    }
  }, [selectedVideo]);

  return (
    <div className="page-container">
      <h1 className="page-title">Video Viewer</h1>
      <select className="dropdown-menu" onChange={(e) => setSelectedVideo(e.target.value)} value={selectedVideo} disabled={loading}>
        {videos.map((video, index) => (
          <option key={index} value={video.id}>
            {video.file_name}
          </option>
        ))}
      </select>
      {selectedVideo && 
      <iframe 
        className="rerun-frame" 
        title="Rerun Web Viewer" 
        key={key}
        src={`http://${process.env.REACT_APP_RR_HOST}:${process.env.REACT_APP_RR_WEBPORT}/?url=ws://${process.env.REACT_APP_RR_HOST}:${process.env.REACT_APP_RR_WSPORT}`}
        />
      }
      <button className="nav-button" onClick={() => navigate('/')} disabled={loading}>Upload another video</button>
    </div>
  );
}

export default VideoViewer;