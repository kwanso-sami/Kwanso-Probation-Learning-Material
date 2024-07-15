import React from "react";
import "./App.css";

import IncrementCounter from "./Components/IncrementCounter";
import DecrementCounter from "./Components/DecrementCounter";

const App = () => {
  return (
    <>
      <IncrementCounter />
      <DecrementCounter />
    </>
  );
};

export default App;
