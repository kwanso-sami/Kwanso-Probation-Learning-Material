import React from "react";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "I am a Class Component (UserProfile.jsx), child of Form.jsx",
    };
  }


  componentDidUpdate(prevProps) {
    if (prevProps.name !== this.props.name || prevProps.city !== this.props.city || prevProps.country !== this.props.country) {
      console.log("Props updated in UserProfile component:", this.props);
    }
  }

  render() {
    return (
      <>
        <h2>{this.state.message}</h2>
        <br />

        <h3>User Profile:</h3>
        <p>
          <strong>Name:</strong> {this.props.name}
        </p>
        <p>
          <strong>City:</strong> {this.props.city}
        </p>
        <p>
          <strong>Country:</strong> {this.props.country}
        </p>
      </>
    );
  }
}
export default UserProfile;
