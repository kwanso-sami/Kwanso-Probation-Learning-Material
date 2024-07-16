import React from "react";

import Form from "./Form";

class IncrementCounter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
    };
  }

  componentDidMount() {
    console.log("Component mounted");
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.count !== this.state.count) {
      console.log("Counter updated:", this.state.count);
    }
  }

  componentWillUnmount() {
    console.log("Component will unmount");
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
          I am Class Component (IncrementCounter.jsx), the first child of
          App.jsx
        </h2>
        
        <p>Count: {this.state.count}</p>
        <button onClick={this.incrementCount}>Increment</button>

        <Form
          prop1={{ msg: "hello world" }} //passing object as a prop
          prop2={["react", "angular", "vue"]} //passing array as a prop
          prop3={"helloworld 2"} //passing string as a prop
        />
      </>
    );
  }
}
export default IncrementCounter;
