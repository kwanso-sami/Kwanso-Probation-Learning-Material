// import React, { useState, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import UserContext from "../../context/UserContext";

// function SignUp() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const navigate = useNavigate();
//   const { setUser } = useContext(UserContext);

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     console.log(name, email, password);
//     setUser({ name, email, password });
//     navigate("/login",{ replace: true });
//   };

//   return (
//     <div className="flex flex-col min-h-screen overflow-hidden">
//       {/*  Page content */}
//       <main className="flex-grow">
//         <section className="bg-gradient-to-b from-gray-100 to-white">
//           <div className="max-w-6xl px-4 mx-auto sm:px-6">
//             <div className="pt-32 pb-12 md:pt-40 md:pb-20">
//               {/* Page header */}
//               <div className="max-w-3xl pb-12 mx-auto text-center md:pb-20">
//                 <h1 className="h1">
//                   Welcome. We exist to make software house registeration easier.
//                 </h1>
//               </div>

//               {/* Form */}
//               <div className="max-w-sm mx-auto">
//                 <form onSubmit={handleSubmit}>
//                   <div className="flex flex-wrap mb-4 -mx-3">
//                     <div className="w-full px-3">
//                       <label
//                         className="block mb-1 text-sm font-medium text-gray-800"
//                         htmlFor="name"
//                       >
//                         Name <span clasName="text-red-600">*</span>
//                       </label>
//                       <input
//                         id="name"
//                         type="text"
//                         className="w-full text-gray-800 form-input"
//                         placeholder="Enter your name"
//                         onChange={(e) => setName(e.target.value)}
//                         required
//                       />
//                     </div>
//                   </div>
//                   <div className="flex flex-wrap mb-4 -mx-3">
//                     <div className="w-full px-3">
//                       <label
//                         className="block mb-1 text-sm font-medium text-gray-800"
//                         htmlFor="email"
//                       >
//                         Email <span className="text-red-600">*</span>
//                       </label>
//                       <input
//                         id="email"
//                         type="email"
//                         className="w-full text-gray-800 form-input"
//                         placeholder="Enter your email address"
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                       />
//                     </div>
//                   </div>
//                   <div className="flex flex-wrap mb-4 -mx-3">
//                     <div className="w-full px-3">
//                       <label
//                         className="block mb-1 text-sm font-medium text-gray-800"
//                         htmlFor="password"
//                       >
//                         Password <span className="text-red-600">*</span>
//                       </label>
//                       <input
//                         id="password"
//                         type="password"
//                         className="w-full text-gray-800 form-input"
//                         placeholder="Enter your password"
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                       />
//                     </div>
//                   </div>
//                   <div className="flex flex-wrap mt-6 -mx-3">
//                     <div className="w-full px-3">
//                       <button className="w-full text-white bg-blue-600 btn hover:bg-blue-700">
//                         Sign up
//                       </button>
//                     </div>
//                   </div>
//                 </form>

//                 <div className="flex items-center my-6">
//                   <div
//                     className="flex-grow mr-3 border-t border-gray-300"
//                     aria-hidden="true"
//                   ></div>
//                   <div className="italic text-gray-600">Or</div>
//                   <div
//                     className="flex-grow ml-3 border-t border-gray-300"
//                     aria-hidden="true"
//                   ></div>
//                 </div>

//                 <div className="mt-6 text-center text-gray-600">
//                   Already have an account?{" "}
//                   <Link
//                     to="/login"
//                     className="text-blue-600 transition duration-150 ease-in-out hover:underline"
//                   >
//                     Log in
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }

// export default SignUp;


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
