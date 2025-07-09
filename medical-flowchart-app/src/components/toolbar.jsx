import React from 'react';
import '../styles/toolbar.css'; // Import specific styles for Toolbar
import Pointer from'../assets/Pointer.png'
import Rectangle from '../assets/Rectangle.png'
import Comment from '../assets/Comment.png'
import Text from '../assets/Text.png'
import Pen from '../assets/Pen.png'

const Toolbar = ( ) => {
  return (
    <div className='toolbar'>
        <ul>
            <li><img src={Pointer}></img></li>
            <li draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('application/reactflow', JSON.stringify({ label: 'Drag me' }));
            e.dataTransfer.effectAllowed = 'move';
          }}
          ><img src={Rectangle}></img></li>
            <li><img src={Comment}></img></li>
            <li><img src={Text}></img></li>
            <li><img src={Pen}></img></li>
            
            
        </ul>
    </div>
    
  );
};

export default Toolbar;
