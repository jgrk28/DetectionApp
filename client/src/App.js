import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import VideoUpload from './VideoUpload';
import VideoViewer from './VideoViewer';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Upload Video</Link>
            </li>
            <li>
              <Link to="/view">View Video</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<VideoUpload />} />
          <Route path="/view" element={<VideoViewer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
