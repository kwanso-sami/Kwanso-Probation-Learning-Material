import React from "react";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message:
        "I am a Class Component (UserProfile.jsx), the child of Form.jsx",
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.name !== this.props.name ||
      prevProps.email !== this.props.email
    ) {
      console.log(
        "Props updated in UserProfile component:",
        this.props.name,
        this.props.email
      );
    }
  }

  render() {
    return (
      <>
        <h2>{this.state.message}</h2>
    

        <h3>User Profile:</h3>
        <p>
          <strong>Name:</strong> {this.props.name}
        </p>
        <p>
          <strong>Email:</strong> {this.props.email}
        </p>
      </>
    );
  }
}
export default UserProfile;
