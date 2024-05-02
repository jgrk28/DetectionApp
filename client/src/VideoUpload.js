import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function VideoUpload() {
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
    } else {
      setVideoFile(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (videoFile) {
      setUploading(true);
      const formData = new FormData();
      formData.append('file_name', videoFile.name);
      formData.append('video', videoFile);

      try {
        const response = await fetch(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/videos/`, {
          method: 'POST',
          body: formData,
        });
        setUploading(false);

        if (response.ok) {
          const data = await response.json();
          console.log('Video uploaded successfully:', data);
          navigate('/view');
        } else {
          throw new Error('Failed to upload video');
        }
      } catch (error) {
        console.error('Error uploading video:', error);
        setUploading(false);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="video/*" onChange={handleVideoChange} disabled={uploading} />
        <button type="submit" disabled={uploading}>Upload Video</button>
      </form>
    </div>
  );
}

export default VideoUpload;