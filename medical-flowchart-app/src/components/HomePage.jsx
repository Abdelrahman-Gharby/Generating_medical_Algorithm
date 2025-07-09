import React from 'react';
import "../styles/HomePage.css"
import "../styles/convert_from_img.css"
// import frameLogo from "../assets/Frame 84.png";
import {Link} from 'react-router-dom';

function HomePage (){
    return(
        <main className="Main">
            <div className="Body" >
                {/* <img src={frameLogo} alt='logo' className='Logo'/> */}
                <h1 className="Title">AI Medical Algorithms</h1>
                <p className="Text">
                Create and analyze medical algorithms with AI.<br/>
                Improve diagnostics, streamline workflows, and enhance patient care.
                </p>
            </div>
        
        <div className="Categories">
            <div className="Buttons">
                <Link to="/Generate" className="Auto">Auto-Generate</Link>
                <Link to="/ManualFlowchart" className="Manual">Manual</Link>
                <Link to="/ConvertImages" className="Convert">Convert from Image</Link>
            </div>
          
        </div>
      </main>

    )
}


export default HomePage ;