import React, { useContext } from "react";
import UserContext from "../../context/UserContext";

function User() {
  const { firstName,lastName,email } = useContext(UserContext);
  return (
    <div className="py-5 text-3xl text-center text-black bg-orange-500">
      User Name: {firstName} {lastName}
      <br />
      User Email: {email}
    </div>
  );
}

export default User;
