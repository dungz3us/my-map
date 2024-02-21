// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Here you would send a request to your Flask backend to authenticate the user
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Handle login success
        console.log('Logged in!');
        setLoginStatus('success');
        // You might want to store the token in local storage
        localStorage.setItem('token', data.access_token);
        navigate('/admin/location');
      } else {
        // Handle errors, such as displaying a message to the user
        console.error('Login failed!');
        setLoginStatus('fail');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group-login">
          <i className="icon-username">
            <img src="https://img.icons8.com/tiny-glyph/16/person-male.png" alt="person-male"/>
          </i> {/* Use an actual icon here */}
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group-login">
          <i className="icon-password">
            <img src="https://img.icons8.com/ios-glyphs/30/password--v1.png" alt="password--v1"/>
          </i> {/* Use an actual icon here */}
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="login-button">LOGIN</button>
        {loginStatus === 'success' && <div className="success-icon">✅ Đăng nhập thành công</div>}
        {loginStatus === 'fail' && <div className="fail-icon">❌ Đăng nhập thất bại</div>}
      </form>
    </div>
  );
}

export default Login;
