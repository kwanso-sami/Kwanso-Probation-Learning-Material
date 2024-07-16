import React from "react";

function FancyBorder(props) {
  return <div>{props.children}</div>;
}

const Component8 = () => {
  return (
    <div>
      <h2>
        I am a functional Component (Component8.jsx), the fifth child of App.jsx
      </h2>

      <FancyBorder>
        {/* all the jsx components inside the FancyBorder (written here) will not be rendered in 
        Parent Component(Component8.jsx), instead they will be rendered in 
        FancyBorder (Child Component of Component8.jsx) via props.children*/}
        <p>Welcome</p>
        <p>Thank you for visiting our spacecraft!</p>
      </FancyBorder>
    </div>
  );
};

export default Component8;
