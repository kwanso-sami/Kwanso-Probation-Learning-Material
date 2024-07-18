import React, { useRef } from 'react';

function HighlightInput() {
  const inputRef = useRef(null);

  const highlightInput = () => {
    inputRef.current.style.backgroundColor = 'yellow';
  };

  return (
    <div>

<h2>
          I am Functional Component, the eighth child of
          App.jsx
        </h2>

      <input ref={inputRef} type="text" placeholder="Type something..." />
      <button onClick={highlightInput}>Highlight Input</button>
    </div>
  );
}

export default HighlightInput;
