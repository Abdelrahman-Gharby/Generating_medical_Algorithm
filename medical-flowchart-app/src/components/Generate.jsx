import React, { useState } from "react";
import "../styles/Generate.css"
import "../styles/convert_from_img.css"
import AI_Icon from '../assets/AI Icon.png'
import { useNavigate } from "react-router-dom";

const MedicalAlgorithmGenerator = () => {
    const [diseaseName, setDiseaseName] = useState("");
    const navigate = useNavigate();

    const handleGenerate = () => {
        if (!diseaseName.trim()) {
            alert("Please enter a disease name.");
            return;
        }

        navigate("/ManualFlowchart", { state: { source: "generate", disease: diseaseName } });
    };
  return (
    <div className="content generate-content">
        <div className="convertImg-header">
            <h2>
                Generate Medical Algorithm to diagnose and treat diseases
            </h2>
            <h5 >
               Write the disease name and our AI will fit the best Algorithm for you
            </h5>
        </div>
        <div className="prompt-input">
            <input
                type="text"
                className="search-input"
                placeholder="disease name (eg. dyspnea, chest pain,...)"
                value={diseaseName}
                onChange={(e) => setDiseaseName(e.target.value)}
            />
        </div>
        <div>
            <button className="generate-btn" onClick={handleGenerate}>
                    Generate
            </button>
        </div>
      
    </div>
  );
};

export default MedicalAlgorithmGenerator;