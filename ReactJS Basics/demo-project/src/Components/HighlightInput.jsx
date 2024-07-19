import React, { useRef, useState, useEffect } from "react";

function HighlightInput() {
  const inputRef = useRef(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    console.log("Component is rendered");
  });

  const highlightInput = () => {
    inputRef.current.style.backgroundColor = "yellow";
  };

  return (
    <div>
      <h2>I am Functional Component, the eighth child of App.jsx</h2>

      <input
        ref={inputRef}
        type="text"
        placeholder="Type something..."
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <p>{msg}</p>
      <button onClick={highlightInput}>Highlight Input</button>
    </div>
  );
}

export default HighlightInput;
