import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import {login} from "../../reduxStore/AuthSlice.jsx"
import {useDispatch} from 'react-redux'
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true); // Show loading state

    try {
      const res = await fetch(`${import.meta.env.VITE_LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ email, password }), 
        credentials: 'include', // ✅ Required to send/receive cookies
      });

      const data = await res.json();
      console.log(data);
      dispatch(login({userData : data}))
      setLoading(false); // Stop loading
      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      setSuccessMessage('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard'); // ✅ Navigate after success
      }, 1500);
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back!</h2>
        <p>Login to continue selling on <span>Shopify by SAUJANYA</span></p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          {/* ✅ Show loading state */}
          {loading && <p className="loading-message">Logging in...</p>}

          {/* ✅ Show error messages */}
          {error && <p className="error-message">{error}</p>}

          {/* ✅ Show success message */}
          {successMessage && <p className="success-message">{successMessage}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="signup-link">New here? <Link to="/signup">Create an Account</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;
