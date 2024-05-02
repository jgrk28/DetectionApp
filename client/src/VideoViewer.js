import React from 'react';

function VideoViewer() {
  return (
    <div>
      <h1>Video Viewer</h1>
      <iframe width={1000} height={600} src="https://app.rerun.io/version/0.14.1/?url=https://app.rerun.io/version/0.14.1/examples/arkit_scenes.rrd"></iframe>
    </div>
  );
}

export default VideoViewer;