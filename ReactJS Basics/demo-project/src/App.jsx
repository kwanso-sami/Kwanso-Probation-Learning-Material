import React from "react";
import "./App.css";

import IncrementCounter from "./Components/IncrementCounter";
import DecrementCounter from "./Components/DecrementCounter";
import ParentComponent from "./Components/ParentComponent";

const App = () => {
  return (
    <>
      <IncrementCounter />
      <hr />
      <DecrementCounter />
      <hr />

      <h4>
        An example where the parent component has a callback function that is
        passed as a prop to the child component. The child component calls this
        callback function in response to a button click.
      </h4>

      <ParentComponent />
    </>
  );
};

export default App;
