import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login-signup.css';
import Navlogo from '../assets/logo.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from "react-toastify";
import { signup } from '../api/authApis';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const isMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;


  const handleRegister = async (e) => {
    e.preventDefault();

    // basic client‑side validation
    if (!email || !username || !password || !confirmPassword) {
      toast.error("Please fill in all required fields!", { autoClose: 3000 });
      return;
    }
    if (
      !isMinLength ||
      !hasUppercase ||
      !hasLowercase ||
      !hasNumber ||
      !hasSpecialChar
    ) {
      toast.error("Password does not meet the security requirements!", {
        autoClose: 3000,
      });
      return;
    }
    if (!passwordsMatch) {
      toast.error("Passwords do not match!", { autoClose: 3000 });
      return;
    }

    // payload expected by backend
    const payload = {
      email,
      username,
      contact_number: contactNumber || "",
      password,
      confirm_password: confirmPassword,
    };

    try {
      await signup(payload);
      toast.success("Registration successful! You can now log in.", {
        autoClose: 3000,
      });
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Registration failed!", { autoClose: 3000 });
    }
  };


  return (
    <div className="login-page">
        <div className="login-container">
            <img src={Navlogo} alt="AI Medical Logo" className="logo" />

            <div className="left-content">
                <h1>
                Sign Up for<br />
                <span className="highlight">AI Medical Algorithm</span>
                <br /> It's simple
                </h1>
                <br />
                <p>
                Already have an account?{' '}
                <a href="/login" className="register-link">
                    Login here!
                </a>
                </p>
            </div>

            <div className="login-form">
                <h2>Sign Up</h2>
                <form onSubmit={handleRegister}>
                <input
                    placeholder="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    placeholder="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    placeholder="Contact Number"
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required
                />

                {/* Password Input */}
                <div>
                <div className="password-container">
                    <input className= "password-input" 
                    placeholder="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                    <span className="eye-icon" onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                <div className="password-rules">
                    <p>{isMinLength ? '✅' : '❌'} At least 8 characters</p>
                    <p>{hasUppercase ? '✅' : '❌'} At least 1 uppercase letter</p>
                    <p>{hasLowercase ? '✅' : '❌'} At least 1 lowercase letter</p>
                    <p>{hasNumber ? '✅' : '❌'} At least 1 number</p>
                    <p>{hasSpecialChar ? '✅' : '❌'} At least 1 special character</p>
                </div>
                </div>

                {/* Confirm Password Input */}
                <div className="password-container">
                    <input className= "password-input"
                    placeholder="Confirm Password"
                    type={showConfPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    />
                    <span className="eye-icon" onClick={() => setShowConfPassword((prev) => !prev)}>
                    {showConfPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                {/* Password Rules */}
                <div className="password-rules">
                    <p>{passwordsMatch ? '✅' : '❌'} Passwords match</p>
                </div>

                <button type="submit">Register</button>
                </form>
            </div>
        </div>
    </div>

  );
};

export default SignUpPage;
