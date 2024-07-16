import React from "react";

const ChildComponent = ({ onMessageChange }) => {
  const sendMessageToParent = () => {
    const newMessage = "Hello from Child Component!";
    onMessageChange(newMessage);
  };

  return (
    <div>
      <h2>
        I am a functional Component (ChildComponent.jsx), the child of
        ParentComponent.jsx
      </h2>
      <button onClick={sendMessageToParent}>Send Message to Parent</button>
    </div>
  );
};

export default ChildComponent;
