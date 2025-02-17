import React, { useState } from "react";

import UserProfile from "./UserProfile";

const Form = ({ prop1, prop2,prop3 }) => {
  const [formData, setFormData] = useState({ name: "", email: "" });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(formData);

    setNameProp(formData.name);
    setEmailProp(formData.email);
  }

  const [nameProp, setNameProp] = useState("Sami");
  const [emailProp, setEmailProp] = useState("samishakoor787@gmail.com");

  return (
    <>
      <h2>
        I am Functional Component (Form.jsx), the child of IncrementCounter.jsx
      </h2>
      
      <p>I receive following props:</p>

      <ul>
        <li>Object Prop: {prop1.msg}</li>
        <li>List Prop: {prop2[0]}, {prop2[1]}, {prop2[2]}</li>
        <li>String Prop: {prop3}</li>
      </ul>
      <br />
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>

      <UserProfile name={nameProp} email={emailProp} />
    </>
  );
};

export default Form;
