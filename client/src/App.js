import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import VideoUpload from './VideoUpload';
import VideoViewer from './VideoViewer';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<VideoUpload />} />
          <Route path="/view" element={<VideoViewer />} />
        </Routes>
    </Router>
  );
}

export default App;
