import Workspace from "../components/workspace";
import Sidebar from "../components/SideBar";
import FlowchartEditor from "../components/flowchart";
import { useState } from "react";

const Manual = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [algorithmName, setAlgorithmName] = useState("");
  return (
    <>
      <Workspace
        nodes={nodes}
        edges={edges}
        setNodes={setNodes}
        setEdges={setEdges}
        title={algorithmName}
        setTitle={setAlgorithmName}
      />
      <Sidebar />
      <FlowchartEditor
        nodes={nodes}
        setNodes={setNodes}
        edges={edges}
        setEdges={setEdges}
        algorithmName={algorithmName}
        setAlgorithmName={setAlgorithmName}
      />
    </>
  );
};

export default Manual;