import React, { useState } from "react";

import UserProfile from "./UserProfile";


const Form = (props) => {
  const [formData, setFormData] = useState({ name: "", email: "" });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(formData);
  }

  return (
    <>
      <h2>I am Functional Component (Form.jsx)</h2>
      <br />
      <p>I receive following props:</p>

      <ul>
        <li>Prop1: {props.prop1}</li>
        <li>Prop2: {props.prop2}</li>
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

      <UserProfile name="Sami" city="Lahore" country="Pakistan"/>
    </>
  );
};

export default Form;
