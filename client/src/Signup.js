import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }
    const signupData = {
      username: username,
      password: password
    };
    try {
      // This is not safe to send plaintext passwords over http as they could be intercepted and read
      const response = await fetch(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData)
      })
      if (response.ok) {
        const data = await response.json();
        navigate("/")
      } else {
          throw new Error('Signup failed');
      }
    } catch (error) {
        console.error('Error:', error);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Signup</h1>
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
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Signup</button>
      </form>
      <button onClick={() => navigate('/login')}>Already have an account?</button>
    </div>
  );
}

export default Signup;
