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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (videoFile) {
      console.log("Uploading", videoFile.name);
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