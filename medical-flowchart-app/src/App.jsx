
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Generate from './pages/generate'
import Manual from './pages/workspace';
import Convert from './pages/convertImage';
import Login from './pages/LoginPage';
import SignUp from './pages/SignUpPage';
import Dashboard from './pages/Dashboard'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {


  return (
    <Router>
      <>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/ManualFlowchart" element={<Manual />} />
          <Route path="/ConvertImages" element={<Convert/>} />
          <Route path="/Generate" element={<Generate/>} />
          <Route path="/Login" element={<Login/>} />
          <Route path="/SignUp" element={<SignUp/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>
      </>
    </Router>
  )
}
export default App