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


  const [name, setName] = useState("Sami");
  const [city, setCity] = useState("Lahore");
  const [country, setCountry] = useState("Pakistan");

  const updateUserProfile = () => {
    setName("Jane Smith");
    setCity("London");
    setCountry("UK");
  };

  return (
    <>
      <h2>I am Functional Component (Form.jsx), the child of IncrementCounter.jsx</h2>
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
      

      <button onClick={updateUserProfile}>Update Profile</button>
      <UserProfile name={name} city={city} country={country} />
      
    </>
  );
};

export default Form;
