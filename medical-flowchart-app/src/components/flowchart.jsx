﻿import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    addEdge,
    Handle,
    Position,
    applyNodeChanges,
    applyEdgeChanges
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../styles/TextUpdaterNode.css';

import { fetchAlgorithm } from '../api/LlamaApi.jsx';

import { v4 as uuidv4 } from 'uuid';
import { ClipLoader } from "react-spinners";
import { Trash2, Edit, Plus, Save, Download, ChevronDown, Search } from "lucide-react";
import { useLocation } from 'react-router-dom';
import infoIcon from '../assets/info.png';

function TextUpdaterNode({ data, isConnectable }) {
  const textareaRef = useRef(null);
  const [showReference, setShowReference] = useState(false);

  const onChange = useCallback((evt) => {
    data.onChange(evt.target.value); // Call the parent's onChange function
  }, [data]);

  // Adjust the height of the textarea based on its content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height to auto
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to scrollHeight
    }
  }, [data.label]); // Re-run effect when `data.label` changes

  return (
    <div className="node-card-container">
      <div className="node-header"></div>

      <div className="node-content">
        <textarea
          id="text"
          name="text"
          value={data.label}
          onChange={onChange}
          className="nodrag node-message-input"
          ref={textareaRef}
        />
      </div>

      <div className="node-info">
        {data.referenceUrl && (
          <div 
            className="info-icon-container"
            onMouseEnter={() => setShowReference(true)}
            onMouseLeave={() => setShowReference(false)}
          >
            <img src={infoIcon} alt="info" className="info-icon" />
            {showReference && (
              <div className="reference-tooltip">
                <a href={data.referenceUrl} target="_blank" rel="noopener noreferrer">
                  {data.referenceUrl}
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </div>
  );
}

const createNode = (Id, text, position, referenceUrl=null) => ({
  id: Id,
  type: 'textUpdaterNode',
  data: { label: text, referenceUrl },
  position,
});

const createEdge = (parentId, childId, label) => ({
    id: `e${parentId}-${childId}`,
    source: parentId,
    target: childId,
    label,
});


function extractNodesAndEdges(data) {
        const nodes = [];
        const edges = [];
        const steps = data.algorithm.steps;
    
        const stepMap = new Map();
        steps.forEach(step => stepMap.set(step.step, step));
    
        // Track depth and x positions
        const depthMap = new Map();
        const depthXMap = new Map(); // Tracks x positions at each depth
        const ySpacing = 350; // Vertical spacing between levels
        const xSpacing = 250; // Horizontal spacing
    
        // Root node initialization
        depthMap.set(steps[0].step, 0);
        depthXMap.set(0, [0]); // Initialize root node at x = 0
    
        function getNextX(depth, parentX, index) {
            if (!depthXMap.has(depth)) {
                depthXMap.set(depth, []);
            }
    
            // Calculate x position based on the index of the node at this depth
            const x = parentX + (index - 0.5) * xSpacing;
    
            // Ensure no overlapping by checking existing x positions at this depth
            const existingX = depthXMap.get(depth);
            if (!existingX.includes(x)) {
                existingX.push(x);
                depthXMap.set(depth, existingX);
                return x;
            } else {
                // If overlapping, find the next available position
                let newX = x;
                while (existingX.includes(newX)) {
                    newX += xSpacing;
                }
                existingX.push(newX);
                depthXMap.set(depth, existingX);
                return newX;
            }
        }
    
        function processStep(step, parentX, depth, index) {
            const x = getNextX(depth, parentX, index);
            const y = depth * ySpacing;
    
            // const node = createNode(`step-${step.step}`, step.Question || step.Action, { x, y });
            const node = createNode(
                `step-${step.step}`,
                step.Question || step.Action,
                {
                    x,
                    y
                },
                step.references?.[0]?.url || null
                );

            nodes.push(node);
    
            if (step.Question) {
                step.options.forEach((option, optionIndex) => {
                    if (stepMap.has(option.nextStep)) {
                        const nextStep = option.nextStep;
                        depthMap.set(nextStep, depth + 1);
    
                        // Process each option with its index
                        processStep(stepMap.get(nextStep), x, depth + 1, optionIndex);
    
                        edges.push({
                            id: `edge-${step.step}-${nextStep}`,
                            source: `step-${step.step}`,
                            target: `step-${nextStep}`,
                            label: option.answer || option.response || option.value
                        });
                    }
                });
            } else if (step.Action && step.nextStep && stepMap.has(step.nextStep)) {
                const nextStep = step.nextStep;
                depthMap.set(nextStep, depth + 1);
    
                // Process the next step with index 0 (only one child)
                processStep(stepMap.get(nextStep), x, depth + 1, 0);
    
                edges.push({
                    id: `edge-${step.step}-${nextStep}`,
                    source: `step-${step.step}`,
                    target: `step-${nextStep}`,
                    label: "Next"
                });
            }
        }
    
        // Start processing from the root node
        processStep(steps[0], 0, 0, 0);
    
        return { nodes, edges };
    }


export { extractNodesAndEdges };

export default function FlowchartEditor({ nodes, setNodes, edges, setEdges, algorithmName, setAlgorithmName }) {
    const location = useLocation();
    const [selectedElement, setSelectedElement] = useState(null);  // Stores the selected node or edge
    const [newLabel, setNewLabel] = useState('');  // Stores the new label input value
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [algorithms, setAlgorithms] = useState([]);
    const [showSaveModal, setShowSaveModal] = useState(false);
    // const [algorithmName, setAlgorithmName] = useState("");
    const fetchedRef = useRef(false);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );

    useEffect(() => {
        const fetchData = async () => {
            if (fetchedRef.current) return;
            fetchedRef.current = true;

            let algorithm;
            try {
                if (location.state?.algorithm) {
                    console.log("Algorithm from Dashboard:", location.state.algorithm.algorithm_json);
                    algorithm = location.state.algorithm.algorithm_json;
                    sessionStorage.setItem("algorithm_id", location.state.algorithm.id);
                    sessionStorage.setItem("algorithm_name", location.state.algorithm.title);
                } else if(location.state?.source === "generate" && location.state?.disease) {
                    setLoading(true);
                    setError(null);
                    const response = await fetchAlgorithm(location.state.disease);
                    // console.log("Fetched Algorithm Response:", response);
                    algorithm = response;
                } else if(location.state?.source=== "upload" && location.state?.flowData){
                    algorithm=location.state?.flowData;
                    // console.log("from the upload:", algorithm);
                } else{
                    console.log("User is manually creating an algorithm. No fetch required.");
                    return;
                }

                if (algorithm) {
                    console.log("Parsed Algorithm:", algorithm);
                    const { nodes, edges } = extractNodesAndEdges(algorithm);
                    setNodes(nodes);
                    setEdges(edges);

                     const maxStep = nodes.reduce((max, n) => {
                        const num = Number(n.id.replace("step-", ""));
                        return isNaN(num) ? max : Math.max(max, num);
                    }, 0);  
                    stepCounter.current = maxStep + 1; 
                }
            } catch (error) {
                console.error("Error fetching algorithm:", error);
            } finally {
                setLoading(false);
                }
            };

        fetchData();
    }, [location.state]);





    const onConnect = useCallback(
        (params) => {
            const newEdge = {
                ...params,  // Spread the params to get source, target, etc.
                label: 'Edge from ' + params.source + ' to ' + params.target,  // Add a label
            };

            setEdges((eds) => addEdge(newEdge, eds));
        } // Add the edge with the label to the edges state
    );


    const stepCounter = useRef(1); // Keeps track of numeric step IDs

    const addNewNode = () => {
        const stepNum = stepCounter.current++;
        const id = `step-${stepNum}`; // Ensures parseInt will succeed
        const label = `New Node ${stepNum}`;
        const newNode = createNode(id, label, { x: 100, y: 100 }, null);
        setNodes((nodes) => [...nodes, newNode]);
    };


    useEffect(() => {
    // find largest numeric step-id in current nodes
    const max = nodes.reduce((m, n) => {
        const num = parseInt(n.id.replace("step-", ""), 10);
        return isNaN(num) ? m : Math.max(m, num);
    }, 0);

  stepCounter.current = max + 1;  // next id will be unique
}, [nodes]); 

    const onNodeClick = (event, node) => {
        setSelectedElement(node);// Select the node to change its label
        setNewLabel(node.data.label);
        
    };

    // Function to handle edge click (to select an edge for label editing)
    const onEdgeClick = (event, edge) => {
        setSelectedElement(edge);// Select the edge to change its label
        setNewLabel(edge.label);
        
    };

    // Handle label input change
    const handleLabelChange = (event) => {
        setNewLabel(event.target.value);
    };

    



    // Apply the new label to the selected element (node or edge)
    const applyLabelChange = () => {
        if (selectedElement) {
            if (selectedElement.source) {
                // If selected element is an edge, update its label
                setEdges((eds) =>
                    eds.map((edge) =>
                        edge.id === selectedElement.id ? { ...edge, label: newLabel } : edge
                    )
                );
            } else {
                // If selected element is a node, update its label
                
                setNodes((nds) =>
                    nds.map((node) =>
                        node.id === selectedElement.id
                            ? { ...node, data: { ...node.data, label: newLabel } }
                            : node
                    )
                );
            }
        }

        setSelectedElement(null);  // Clear selection
        setIsEditMode(false);  // Exit edit mode
        setNewLabel('');  // Reset label input
    };

    const deleteSelectedElement = () => {
        if (!selectedElement) return; // No selection, do nothing

        if (selectedElement.source) {
            // It's an edge, remove it
            setEdges((prevEdges) => prevEdges.filter(edge => edge.id !== selectedElement.id));
        } else {
            // It's a node, remove it and its connected edges
            setNodes((prevNodes) => prevNodes.filter(node => node.id !== selectedElement.id));
            setEdges((prevEdges) => prevEdges.filter(edge => edge.source !== selectedElement.id && edge.target !== selectedElement.id));
        }

        setSelectedElement(null); // Clear selection after deletion
    };

    const saveAlgorithm = async () => {
        if (!algorithmName.trim()) {
            alert("Please enter a name for the algorithm.");
            return;
        }
    
        // Extract nodes and edges into structured JSON
        const structuredAlgorithm = {
            algorithm: {
                steps: nodes.map(node => {
                    const referenceUrl = node.data.referenceUrl || null; 

                    // Extract step number
                    const stepNumber = Number(node.id.replace("step-", ""));
                    const outgoingEdges = edges.filter(e => e.source === node.id);

                    const hasChildren = outgoingEdges.length > 0;


                    const step = {
                    step: isNaN(stepNumber) ? null : stepNumber,
                    Question: hasChildren ? node.data.label : undefined,
                    Action: !hasChildren ? node.data.label : undefined,
                    references: [{ url: referenceUrl }],
                    };
    
                    if (hasChildren) {
                    step.options = outgoingEdges.map(edge => ({
                        answer: edge.label,
                        nextStep: Number(edge.target.replace("step-", "")) || null
                    }));
                    } else {
                        // If it's an Action and has 1 outgoing edge, use nextStep
                        const singleEdge = edges.find(e => e.source === node.id);
                        if (singleEdge) {
                            step.nextStep = Number(singleEdge.target.replace("step-", "")) || null;
                        }
                    }
    
                    return step;
                })
            }
        };
    
        try {
            const response = await fetch("http://127.0.0.1:8000/api/dashboard/", {  
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                },
                body: JSON.stringify({
                    title: algorithmName,
                    algorithm_json: structuredAlgorithm
                })
            });
    
            if (response.ok) {
                alert("Algorithm saved successfully!");
                setShowSaveModal(false);
                // setAlgorithmName("");
            } else {
                const errorData = await response.json();
                alert("Failed to save algorithm: " + JSON.stringify(errorData));
            }
        } catch (error) {
            alert("Error saving algorithm: " + error.message);
        }
    };
    
    
    
    

    // Load the list of saved algorithms
    const loadAlgorithmsList = () => {
        const algorithms = JSON.parse(localStorage.getItem('algorithms')) || [];
        return algorithms;
    };

    
    useEffect(() => {
        const savedAlgorithms = loadAlgorithmsList(); // Load algorithms on initial render
        if (savedAlgorithms.length > 0) {
            setAlgorithms(savedAlgorithms);  // Set list of algorithms
        }
    }, []);

    return (
        <div style={{ 
            display: 'flex', 
            width: '100vw', 
            height: '100vh', 
            position: 'relative', 
            margin: '80px 0px 0px 0px',
            zIndex: 0 
        }}>
            {/* Loading Spinner (Centered) */}
            {loading && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <ClipLoader color="#3498db" size={50} />
                </div>
            )}

            {/* Error Message (Centered & Styled) */}
            {error && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'red', fontSize: '18px' }}>
                    {error}
                </div>
            )}

            {/* ReactFlow - Render only if NOT loading and NO error */}
            {!loading && !error && (
                <div style={{ flexGrow: 1, position: "relative", width: '100%', height: '100%' }}>
                    <ReactFlow
                        style={{ zIndex: 0, width: '100%', height: '100%' }}
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={{ textUpdaterNode: TextUpdaterNode }}
                        onNodeClick={onNodeClick}
                        onEdgeClick={onEdgeClick}
                        fitView
                    >
                        {/* Toolbar Inside ReactFlow Grid */}
                        <div style={{
                            position: "absolute", top: 10, left: 10, zIndex: 1000,
                            background: "rgba(255, 255, 255, 0.9)", padding: "8px",
                            borderRadius: "8px", display: "flex", gap: "10px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                        }}>
                            <button
                                onClick={deleteSelectedElement}
                                disabled={!selectedElement}
                                title="Delete"
                                style={{
                                    border: "none", background: "transparent", cursor: selectedElement ? "pointer" : "not-allowed",
                                    opacity: selectedElement ? 1 : 0.5
                                }}
                            >
                                <Trash2 size={20} />
                            </button>
                            <button
                                onClick={() => setIsEditMode(true)}
                                title="Edit"
                                style={{ border: "none", background: "transparent", cursor: "pointer" }}
                            >
                                <Edit size={20} />
                            </button>
                            <button
                                onClick={addNewNode}
                                title="Add Node"
                                style={{ border: "none", background: "transparent", cursor: "pointer" }}
                            >
                                <Plus size={20} />
                            </button>
                            {/* <button onClick={() => setShowSaveModal(true)} title="Save">
                                <Save size={20} />
                            </button> */}
                            <button
                                onClick={() => {
                                    //const title = sessionStorage.getItem("algorithm_name")?.trim();
                                    if (algorithmName.trim()) {
                                    saveAlgorithm(); //  call directly if title is set
                                    } else {
                                    setShowSaveModal(true); //  show modal only if title is empty
                                    }
                                }}
                                title="Save"
                                >
                                <Save size={20} />
                                </button>
                        </div>

                        {/* Save Algorithm Modal */}
                        {showSaveModal && (
                            <div style={{
                                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                                background: "white", padding: "16px", borderRadius: "8px",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.3)", zIndex: 2000
                            }}>
                                <h3>Save Algorithm</h3>
                                <input
                                    type="text"
                                    value={algorithmName}
                                    onChange={(e) => setAlgorithmName(e.target.value)}
                                    placeholder="Enter algorithm name"
                                    style={{ padding: "6px", width: "100%", border: "1px solid #ccc", borderRadius: "4px" }}
                                />
                                <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                                    {/* <button onClick={saveAlgorithm} style={{ background: "#3498db", color: "white", padding: "6px", borderRadius: "4px" }}>
                                        Save
                                    </button> */}
                                    <button
                                        onClick={() => {
                                            if (algorithmName.trim()) {
                                                saveAlgorithm();
                                            } else {
                                                alert("Please enter a name for the algorithm.");
                                            }
                                        }}
                                        style={{ background: "#3498db", color: "white", padding: "6px", borderRadius: "4px" }}
                                    >
                                        Save
                                    </button>
                                    <button onClick={() => setShowSaveModal(false)} style={{ background: "#e74c3c", color: "white", padding: "6px", borderRadius: "4px" }}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Label Change Input Field */}
                        {isEditMode && selectedElement && (
                            <div
                                className='node-edit'
                                style={{
                                    position: 'absolute',
                                    top: 70, left: 20,
                                    background: "white",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                                    zIndex: 2000,
                                    pointerEvents: "auto"  // Ensure it is clickable
                                }}
                            >
                                <h3 style={{ margin: "0 0 5px 0", fontSize: "14px" }}>Change Label</h3>
                                <input
                                    type="text"
                                    value={newLabel}
                                    onChange={handleLabelChange}
                                    placeholder="Enter new label"
                                    style={{
                                        width: "100%",
                                        padding: "6px",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                        outline: "none",
                                        fontSize: "14px"
                                    }}
                                />
                                <button
                                    onClick={applyLabelChange}
                                    style={{
                                        marginTop: "8px",
                                        width: "100%",
                                        padding: "6px",
                                        background: "#3498db",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer"
                                    }}
                                >
                                    Apply
                                </button>
                            </div>
                        )}

                        {/* ReactFlow Controls */}
                        <Controls />
                        <MiniMap 
                            style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                zIndex: 1000,
                                height:100,
                            }}
                        />
                        <Background variant="dots" gap={12} size={1} bgColor='white' />
                    </ReactFlow>
                </div>
            )}
        </div>
    );
}