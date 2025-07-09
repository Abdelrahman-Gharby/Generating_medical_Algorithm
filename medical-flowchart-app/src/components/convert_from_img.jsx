import React, { useState, useRef } from "react";
import "../styles/convert_from_img.css";
import uploadIcon  from "../assets/upload (1).png";
import removeIcon  from "../assets/Remove.png";
import { useNavigate }  from "react-router-dom";
import { convertImage } from "../api/convertImageApi"

function Uploader({ onJsonReady }) {
  const fileInputRef = useRef(null);
  const [file,    setFile]    = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("No selected file");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  /* ---------- pick file ---------- */
  const handlePick = ({ target: { files } }) => {
    if (!files?.length) return;
    const selected = files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setFileName(selected.name);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    try {
      const data = await convertImage(file);
      onJsonReady?.(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

   /* ---------- remove file ---------- */
  const reset = () => {
    setFile(null);
    setPreview(null);
    setFileName("No file selected");
    fileInputRef.current.value = null;
  };

  return (
    <main className="uploader">
      <form onSubmit={handleSubmit}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handlePick}
          className="input-field"
        />

        <div onClick={() => fileInputRef.current.click()}>
          {preview ? (
            <img src={preview} alt={fileName} width={100} height={100} />
          ) : (
            <>
              <img src={uploadIcon} alt="upload" />
              <p>Browse files to upload</p>
            </>
          )}
        </div>

        {file && (
          <button className="img-submit-btn" disabled={loading}>
            {loading ? "Processing…" : "Submit image"}
          </button>
        )}
      </form>

      <section className="uploaded-row">
        <span>{fileName}</span>
        {file && <img src={removeIcon} onClick={reset} alt="remove" />}
      </section>

      {error && <p className="error-msg">{error}</p>}
    </main>
  );
}
export default function ConvertFromImg() {
  const navigate = useNavigate();

  const handleJson = (json) => {
    // console.log("Received JSON from backend:", json);
    navigate("/ManualFlowchart", { state: { source: "upload",flowData: json } });
  };

  return (
    <div className="content">
      <header className="convertImg-header">
        <h2>Convert Your Image to an Interactive Flow‑chart</h2>
        <h5>Edit your handwritten flow‑chart freely and customize your algorithm</h5>
      </header>

      <div className="convertImg-media">
        <h3>Media Upload</h3>
        <h4>Add your documents here</h4>

        <div className="convertImg-upload">
          <Uploader onJsonReady={handleJson} />
        </div>
      </div>

    </div>
  );
}
