import React from "react";



// withLoading is a wrapper component
const withLoading = (WrappedComponent) => {
  class WithLoading extends React.Component {
    state = {
      isLoading: true,
    };

    componentDidMount() {
      setTimeout(() => {
        this.setState({ isLoading: false });
      }, 2000);
    }

    render() {
      return (
        <WrappedComponent {...this.props} loading={this.state.isLoading} />
      );
    }
  }

  return WithLoading;
};

const MyComponent = ({ loading }) => (
  <div>{loading ? <p>Loading...</p> : <p>Hello, world!</p>}</div>
);

// withLoading is a HOC that takes MyComponent as an argument
const MyComponentWithLoading = withLoading(MyComponent);

const Component9 = () => {
  return (
    <div>
      <h2>
        I am a functional Component (Component8.jsx), the sixth child of App.jsx
      </h2>
      
      <MyComponentWithLoading />
    </div>
  );
};

export default Component9;
