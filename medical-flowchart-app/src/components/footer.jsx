import React from 'react';
import '../styles/Footer.css'; // Import specific styles for Navbar
import yashfii_logo from '../assets/yashfii.svg'
import facebook from '../assets/Facebook.png'
import ig from '../assets/Instagram.png'
import Twitter from '../assets/Twitter.png'
import linkedin from '../assets/LinkedIn.png'

const Footer = ( ) => {
  return (
    <div className='footer-container'>
        <div className='footer-content'>
           
            <img src={yashfii_logo} alt='yashfii_logo'></img>
            
            <div className='footer-info'>
                <ul>
                        <li><a href='#'>Concept</a></li>
                        <li><a href='#'>Our story</a></li>
                        <li><a href='#'>Blog</a></li>
                        <li><a href='#'>Contact us</a></li>
                        
                </ul>
            </div>
            <div className='social-media'>
                <a href='#'> <img src={facebook} alt='facebook logo'></img></a>
                <a href='#'> <img src={ig} alt='ig logo'></img></a>
                <a href='#'> <img src={Twitter} alt='Twitter logo'></img></a>
                <a href='#'> <img src={linkedin} alt='linkedin logo'></img></a>
            </div>
            
        </div>
        <div className='footer-terms'>
            <ul>
                <li><a href='#'>Privacy Policy</a></li>
                <li><a href='#'>Terms of Service</a></li>
                <li><a href='#'>Cookies Settings</a></li>
                
            </ul>
        </div>
    </div>
    
  );
};

export default Footer;