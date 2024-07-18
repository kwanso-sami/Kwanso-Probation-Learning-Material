import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(name, email, password);
    setUser({ name, email, password });
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <div className="w-full max-w-sm px-6 py-10 bg-white rounded-lg shadow-md">
        <h1 className="mb-8 text-2xl font-bold text-center">
         Join us today!
        </h1>
      
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block mb-1 text-sm font-medium text-gray-800"
            >
              Name{" "}
              <span className="text-red-600">*</span>
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-4 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-gray-800"
            >
              Email{" "}
              <span className="text-red-600">*</span>
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
              Password{" "}
              <span className="text-red-600">*</span>
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
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Sign up
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow mr-3 border-t border-gray-300" aria-hidden="true"></div>
          <div className="italic text-gray-600">Or</div>
          <div className="flex-grow ml-3 border-t border-gray-300" aria-hidden="true"></div>
        </div>

        <div className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 transition duration-150 ease-in-out hover:underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
