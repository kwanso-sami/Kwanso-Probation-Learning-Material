import React from "react";

import IncrementCounter from "./Components/IncrementCounter";
import DecrementCounter from "./Components/DecrementCounter";
import ParentComponent from "./Components/ParentComponent";
import Component7 from "./Components/Component7";
import Component8 from "./Components/Component8";
import Component9 from "./Components/Component9";
import ComponentX from "./Components/ComponentX";

const App = () => {
  return (
    <>
      <IncrementCounter />
      <hr />
      
      <DecrementCounter />
      <hr />

      <h4>
        An example where the parent component has a callback function that is
        passed as a prop to the child component (i-e, Render Prop). The child
        component calls this callback function in response to a button click.
      </h4>
      <ParentComponent />
      <hr />

      <h4>
        This is an example of parent component passing components as props to
        its child component
      </h4>
      <Component7 />
      <hr />

      <h4>This is an example of "props.children" </h4>
      <Component8 />
      <hr />

      <h4>This is an example of HOC </h4>
      <Component9 />
      <hr />

      <h4>
        This is an example of two sibling components communicating with each
        other through a shared common parent component (via Lifting State Up){" "}
      </h4>
      <ComponentX />
    </>
  );
};

export default App;
