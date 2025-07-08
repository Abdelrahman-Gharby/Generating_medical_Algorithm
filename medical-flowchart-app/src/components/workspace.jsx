
import React from 'react';
import '../styles/Workspace.css';
import share_icon from "../assets/share.png"
import back_icon from "../assets/back_icon.png"
import upload_icon from "../assets/upload (1).png"
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { extractNodesAndEdges } from "../components/flowchart"; 


const Workspace = ({ nodes = [], edges = [], setNodes, setEdges, title, setTitle}) => {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    // const [title,setTitle]= useState("");
    const [date,setDate]= useState(new Date())

    const handleBackClick = () => {
        sessionStorage.removeItem("algorithm_id");
        sessionStorage.removeItem("algorithm_name");
        navigate(-1);
    };

    useEffect(() => {
            const name = sessionStorage.getItem("algorithm_name");
            if (name) {
                setTitle(name);
            }
        }, []);

    const buildAlgorithmJson = () => ({
        algorithm: {
        steps: nodes.map((node) => {
            const refUrl = node.data.referenceUrl || null;
            const stepNum = Number(node.id.replace("step-", ""));
            const outgoing = edges.filter((e) => e.source === node.id);
            const hasChildren = outgoing.length > 0;

            const step = {
            step: isNaN(stepNum) ? null : stepNum,
            Question: hasChildren ? node.data.label : undefined,
            Action: !hasChildren ? node.data.label : undefined,
            references: [{ url: refUrl }],
            };

            if (hasChildren) {
            step.options = outgoing.map((e) => ({
                answer: e.label || "Next",
                nextStep: Number(e.target.replace("step-", "")) || null,
            }));
            } else if (outgoing.length === 1) {
            step.nextStep = Number(outgoing[0].target.replace("step-", "")) || null;
            }

            return step;
        }),
        },
    });
    const handleShareClick = () => {
        const json = buildAlgorithmJson();
        const blob = new Blob([JSON.stringify(json, null, 2)], {
        type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "algorithm.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleUploadClick   = () => fileInputRef.current.click();
    const handleFileSelected  = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
        try {
            const json          = JSON.parse(evt.target.result);
            const { nodes, edges } = extractNodesAndEdges(json);   // reuse your logic
            setNodes(nodes);
            setEdges(edges);
            setTitle(file.name.replace(/\.json$/i, ""));
            setDate(new Date());
        } catch {
            alert("❌ Not a valid algorithm.json file");
        }
        };
        reader.readAsText(file);
    };

  return (
    <div className='workspace-nav'>
        <div className='nav-left'>
            <button className='back-btn' onClick={handleBackClick}>
                <img src={back_icon} alt='back-icon'/> 
            </button>
            <div className='title'>
                <input className="algo-name" value={title} onChange={(e)=> setTitle(e.target.value)} placeholder='Enter Algorithm name' />
                
                <h5>
                    last save {date.toLocaleString()}
                </h5>

            </div>
        </div>
        <div className='nav-right'>
            
            <button className="share-btn" onClick={handleShareClick}>
                <span>Share</span>
                <img src={share_icon} alt="share-icon" />
            </button>

            <button className="share-btn" onClick={handleUploadClick}>
                <span>Upload</span>
                <img src={upload_icon} alt="upload" />
            </button>
           
           {/* hidden file input */}
            <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileSelected}
            />

        </div>
    </div>
  );
};

export default Workspace;
