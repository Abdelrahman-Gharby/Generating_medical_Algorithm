import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login-signup.css';
import Navlogo from '../assets/logo.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { login } from '../api/authApis';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);

      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('username', data.username);

      toast.success('Login successful!', {
        autoClose: 3000,
        position: 'top-right',
      });

      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      toast.error(err.message || 'Login failed!', {
        autoClose: 3000,
        position: 'top-right',
      });
    }
  };
  
  
  return (
    <div className="login-page">
        <div className="login-container">
        <img src={Navlogo} alt="AI Medical Logo" className="logo" />
        
        <div className="left-content">
            <h1>Sign in to <br /><span className="highlight">AI Medical Algorithm</span><br/> is simple</h1>
            <br/>
            <p>
            If you do not have an account,<br/> you can{" "}
            <Link to="/signup" className="register-link">Register here!</Link>
            </p>      
            </div>

        <div className="login-form">
            <h2>Sign in</h2>
            <form onSubmit={handleLogin}>
            <input 
                placeholder= 'Email Address'
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
            />
            
            <div className="password-container">
            <input 
                placeholder="Password" 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            </div>

            <button type="submit">Login</button>
            </form>
        </div>
        </div>
    </div>

  );
};

export default LoginPage;
