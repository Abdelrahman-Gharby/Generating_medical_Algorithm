import React, { useState } from 'react';
import '../styles/SideBar.css'; // Import specific styles for Sidebar
import CommentSection from "../components/comment.jsx"

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Slide-up button for all screens */}
      {!open && (
        <button className="sidebar-toggle-btn" onClick={() => setOpen(true)}>
          Comments ▲
        </button>
      )}
      <div className={`sidebar${open ? ' open' : ' closed'}`}>
        <div className='comments-header'>
          <h2>Comments</h2>
          {open && (
            <button className="sidebar-toggle-btn close" onClick={() => setOpen(false)}>
              Close ▼
            </button>
          )}
        </div>
        <div className='comment-sec'>
          <CommentSection />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
