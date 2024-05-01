import React from 'react';

function VideoViewer() {
  return (
    <div>
      <h1>Video Viewer</h1>
      {/* Test video TODO add real viewer */}
      <video width="720" controls>
        <source src="test.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default VideoViewer;