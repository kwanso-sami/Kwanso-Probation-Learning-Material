import React from "react";


import Form from "./Form";


class IncrementCounter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
     count:0
    };
  }

  

  incrementCount = () => {
    this.setState((prevState) => ({
      count: prevState.count + 1,
    }));
  };

  render() {
    return (
      <>
        <h2>

        I am Class Component (IncrementCounter.jsx)
        </h2>
        <br />
        <p>Count: {this.state.count}</p>
        <button onClick={this.incrementCount}>Increment</button>
  
        <Form prop1="hello" prop2="world"/>
      </>
    );
  }
}
export default IncrementCounter;
