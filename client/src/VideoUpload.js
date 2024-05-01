import React, { useState } from 'react';

function VideoUpload() {
  const [videoFile, setVideoFile] = useState(null);

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
      const formData = new FormData();
      formData.append('file_name', videoFile.name);
      formData.append('video', videoFile);

      try {
        const response = await fetch(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/videos/`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Video uploaded successfully:', data);
        } else {
          throw new Error('Failed to upload video');
        }
      } catch (error) {
        console.error('Error uploading video:', error);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="video/*" onChange={handleVideoChange} />
        <button type="submit">Upload Video</button>
      </form>
    </div>
  );
}

export default VideoUpload;