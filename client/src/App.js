import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import VideoUpload from './VideoUpload';
import VideoViewer from './VideoViewer';
import Login from './Login';
import Signup from './Signup';

function App() {
  return (
      <Router>
          <Routes>
            <Route path="/" element={<VideoUpload />} />
            <Route path="/view" element={<VideoViewer />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
      </Router>
   
  );
}

export default App;
