import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const { user, setIsLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(email, password);

    if (!user) {
      alert("Please SignUp first!");
      navigate("/signup", { replace: true });
      return;
    }

    if (email === user.email && password === user.password) {
      setIsLoggedIn(true);
      navigate("/user", { replace: true });
    } else {
      alert("Invalid email or password!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <div className="w-full max-w-sm px-6 py-10 bg-white rounded-lg shadow-md">
        <h1 className="mb-8 text-2xl font-bold text-center">Welcome Back!</h1>
      
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-gray-800"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-gray-800"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
              />
              <span className="ml-2 text-gray-600">Keep me signed in</span>
            </label>
            <Link
              to="/reset-password"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}

export default LogIn;
