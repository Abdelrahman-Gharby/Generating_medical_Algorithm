import React, { useEffect,useState } from 'react';
import '../styles/Dashboard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useNavigate } from "react-router-dom";
import {getAlgorithms} from "../api/dashboardApis"
import { deleteAlgorithm } from "../api/dashboardApis";

const Header = () => {
  return (
    <header>

    <div className="header">
      <h1>AI Medical</h1>
      <nav>
      <ul>
        <li> Home </li>
        <li>Auto-Generate</li>
        <li>Manual</li>
        <li>Convert from image</li>
        <li className="drop"> User </li>
      </ul>
      </nav>

      <hr className="gray-line" /> {/* Gray line */}

    </div>
    </header>
  );
} 

const Sidebar = () => {
  const username = localStorage.getItem("username");
  return (
    <aside className="side">
      <div>
        <div className='profile'>Profile / My Dashboard</div>
        <div className='user'><h1>{username}'s Dashboard</h1></div>
      </div>
      {/* <ShareButton /> */}
    </aside>
  );
};



const Algorithms = ({ num_algorithm }) => {
  
  return (
    <div>
      <div className="container">
        <p className="algorithm">My Algorithms</p>
        <div className="num_algorithm"><span>{num_algorithm}</span></div>
      </div>
      <hr className="black_line" />
          </div>
  );
};


const Cards = () => {
  const [algorithms, setAlgorithms] = useState([]);
  const [numAlgorithm, setNumAlgorithm] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAlgorithms();
        setAlgorithms(data);
        setNumAlgorithm(data.length);
      } catch (err) {
        console.error("Failed to fetch algorithms:", err.message);
      }
    };
    load();
  }, []);

  const goToManualPage = (algorithm) => {
    navigate("/ManualFlowchart", { state: { algorithm } });
  };

  
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this algorithm?")) return;

    try {
      await deleteAlgorithm(id);
      setAlgorithms((prev) => prev.filter((a) => a.id !== id));
      setNumAlgorithm((prev) => prev - 1);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Algorithms num_algorithm={numAlgorithm} />
      <div className="cards-container">
        <div className="cards">
          {algorithms.map((algorithm, index) => (
            <div className="card" key={index}>
              <h3>{algorithm.title}</h3>
              <p>{JSON.stringify(algorithm.algorithm)}</p>
              <div className="badge-row">
              <span className="badge edit" onClick={() => goToManualPage(algorithm)}>
                Edit
              </span>
              <span className="badge delete" onClick={() => handleDelete(algorithm.id)}>
                Delete
              </span>
             </div>
              <hr className="light-gray-line" />
              <div className="footer">
                <span>Last Updated</span> <span>{new Date(algorithm.last_updated).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      
      <Cards />
      <Footer />
    </div>
  );
};

export default Dashboard;