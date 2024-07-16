import React, { useState } from "react";
import ChildComponent from "./ChildComponent";

const ParentComponent = () => {
  const [message, setMessage] = useState("Waiting");

  const handleMessageChange = (newMessage) => {
    setMessage(newMessage);
  };

  return (
    <div>
      <h2>
        I am a functional Component (ParentComponent.jsx), the third child of
        App.jsx
      </h2>
      <p>Message from child: {message}</p>
      <ChildComponent onMessageChange={handleMessageChange} />
    </div>
  );
};

export default ParentComponent;
