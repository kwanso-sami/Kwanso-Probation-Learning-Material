import React from "react";

function SplitPane(props) {
  return (
    <div>
      <div>{props.left}</div>
      <div>{props.right}</div>
    </div>
  );
}

const Component7 = () => {
  return (
    <div>
      <h2>
        I am a functional Component (Component7.jsx), the fourth child of
        App.jsx
      </h2>

      <SplitPane left={<LeftComponent />} right={<RightComponent />} />
    </div>
  );
};

function LeftComponent() {
  return <div>Left Side</div>;
}

function RightComponent() {
  return <div>Right Side</div>;
}

export default Component7;
