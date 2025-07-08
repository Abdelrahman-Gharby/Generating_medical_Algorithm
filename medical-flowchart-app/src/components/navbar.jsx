import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/navbar.css';
import { logout } from '../api/authApis';
import Navlogo from '../assets/logo.png';
import UserIcon from '../assets/user_icon.png';
import arrow from '../assets/arrow.png';
import dashboard_icon from '../assets/dashboard.png';
import help_icon from '../assets/help.png';
import Setting from '../assets/settings.png';
import log_out from '../assets/sign out.png';
import icon from '../assets/menu.png'

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const username = localStorage.getItem('username');
    const [menuOpen, setMenuOpen] = useState(false);
    const navListRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (navListRef.current && !navListRef.current.contains(event.target)) {
          setMenuOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const handleLogout = async () => {
      try {
        await logout();
      } catch (err) {
        console.error("Logout error:", err.message);
      }

      // Clear localStorage & navigate regardless of server success
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('username');
      navigate('/login');
    };

    // Close menu on link click (mobile)
    const handleNavLinkClick = () => {
      setMenuOpen(false);
    };

  return (
    <div className='navbar'>
      <div className='nav-container'>
        <div className='nav-left-side'>
          <div className='nav-logo'>
            <div className='logo-image'>
              <img src={Navlogo} alt='logo'></img>
            </div>
            <div className='logo-text'>
              <span>Roshta</span>
            </div>
          </div>
          {/* Hamburger button for mobile */}
          <button className='hamburger' onClick={() => setMenuOpen((open) => !open)} aria-label='Toggle menu'>
            <img src={icon} alt='menu'/>
          </button>
          <div className={`nav-list${menuOpen ? ' open' : ''}`} ref={navListRef}>
            <ul>
                <li className={location.pathname === "/" ? "selected" : ""} onClick={handleNavLinkClick}>
                  <Link to="/">Home</Link>
                </li>
                <li className={location.pathname === "/Generate" ? "selected" : ""} onClick={handleNavLinkClick}>
                    <Link to="/Generate">Auto-Generate</Link>
                </li>
                <li className={location.pathname === "/ManualFlowchart" ? "selected" : ""} onClick={handleNavLinkClick}>
                    <Link to="/ManualFlowchart">Manual</Link>
                </li>
                <li className={location.pathname === "/ConvertImages" ? "selected" : ""} onClick={handleNavLinkClick}>
                    <Link to="/ConvertImages">Convert From Image</Link>
                </li>
              </ul>
          </div>
        </div>
        <div className='nav-right-side'>
          <div className='dropdown'>
            <button className="dropbtn">
              <img src={UserIcon} alt='profile-pic'></img>
              <span>{username}</span>
              <img className='arrow' src={arrow} alt='arrow'></img>
            </button>
            <div className="dropdown-content">
              <Link to="/dashboard">
                <img src={dashboard_icon} alt='icon'></img>
                <span>My Dashboard</span>
              </Link>
              <Link to="/settings">
                <img src={Setting} alt='icon'></img>
                <span>Profile Setting</span>
              </Link>
              <Link to="/help">
                <img src={help_icon} alt='icon'></img>
                <span>Help Center</span>
              </Link>
              <Link to="/login" onClick={handleLogout}>
                <img src={log_out} alt="icon" />
                <span>Log Out</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
