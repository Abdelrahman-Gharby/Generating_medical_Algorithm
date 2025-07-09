import React, { useState } from 'react';
import '../styles/TextUpdaterNode.css'; // Import specific styles for TextUpdaterNode

const TextUpdaterNode = ({ data }) => {
  const [text, setText] = useState(data.label);

  const handleChange = (event) => {
    setText(event.target.value);
    data.onChange(event.target.value); // Call onChange to update the parent state
  };

  return (
    <div className="text-updater">
      <h2>Text Updater Node</h2>
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Type your text here..."
      />
      <p>Output: {text}</p>
    </div>
  );
};

export default TextUpdaterNode;
