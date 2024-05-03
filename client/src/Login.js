import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const loginData = {
      username: username,
      password: password
    };
    try {
      // This is not safe to send plaintext passwords over http as they could be intercepted and read
      const response = await fetch(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      })
      if (response.ok) {
        const data = await response.json();
        navigate("/")
      } else {
          throw new Error('Login failed');
      }
    } catch (error) {
        console.error('Error:', error);
    }    
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Login</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <button onClick={() => navigate('/signup')}>Don't have an account?</button>
    </div>
  );
}

export default Login;
