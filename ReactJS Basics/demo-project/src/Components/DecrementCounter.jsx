import React from "react";



class DecrementCounter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
     count:15
    };
  }

  

  decrementCount = () => {
    this.setState((prevState) => ({
      count: prevState.count > 0 ? prevState.count - 1 : prevState.count,
    }));
  };

  render() {
    return (
      <>
        <h2>
        I am Class Component (DecrementCounter.jsx), the second child of App.jsx
        </h2>
        <br />
        <p>Count: {this.state.count}</p>
      
        <button onClick={this.decrementCount}>Decrement</button>
       
      </>
    );
  }
}
export default DecrementCounter;
