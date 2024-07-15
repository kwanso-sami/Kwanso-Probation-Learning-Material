import React from "react";
import "./App.css";

import IncrementCounter from "./IncrementCounter";
import DecrementCounter from "./DecrementCounter";

const App = () => {
  return (
    <>
      <IncrementCounter />
      <DecrementCounter />
    </>
  );
};

export default App;
