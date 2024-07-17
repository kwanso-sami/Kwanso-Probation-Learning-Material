import React, { useState } from "react";

const ChildComponent1 = ({ onChange }) => {
  const handleInputChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div>
      <h4>I am a first child component of ComponentX.jsx</h4>
      <input type="text" onChange={handleInputChange} />
    </div>
  );
};

const ChildComponent2 = ({ value }) => {
  return (
    <div>
      <h4>I am a second child component of ComponentX.jsx</h4>
      <p>Shared Value: {value}</p>
    </div>
  );
};

const ComponentX = () => {
  const [sharedState, setSharedState] = useState("");

  const handleChange = (newValue) => {
    setSharedState(newValue);
  };

  return (
    <div>
      <h2>
        I am a functional Component (ComponentX.jsx), the seventh child of
        App.jsx
      </h2>

      <ChildComponent1 onChange={handleChange} />
      
      <ChildComponent2 value={sharedState} />
    </div>
  );
};

export default ComponentX;
