import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import UserContext from "../../context/UserContext";

export default function Header() {
  const { isLoggedIn, setUser, setIsLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  const signOut = () => {
    setUser(null);
    setIsLoggedIn(false);

    navigate("/home", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 shadow">
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap items-center justify-between max-w-screen-xl mx-auto">
          <Link to="/" className="flex items-center">
            <img
              src="https://alexharkness.com/wp-content/uploads/2020/06/logo-2.png"
              className="h-12 mr-3"
              alt="Logo"
            />
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center lg:order-2">
              <Link
                className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                onClick={signOut}
              >
                SignOut
              </Link>
            </div>
          ) : (
            <div className="flex items-center lg:order-2">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 
                            ${isActive ? "text-orange-700" : "text-gray-700"
                  } text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                }
              >
                LogIn
              </NavLink>

              <Link
                to="/signup"
                className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
              >
                SignUp
              </Link>
            </div>
          )}

          <div
            className="items-center justify-between hidden w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <NavLink
                  to="/"
                  replace
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 
                                        ${isActive
                      ? "text-orange-700"
                      : "text-gray-700"
                    } lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                  }
                >
                  Home
                </NavLink>
              </li>

              {isLoggedIn && (
                <li>
                  <NavLink
                    to="/user"
                    replace
                    className={({ isActive }) =>
                      `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 
                                        ${isActive
                        ? "text-orange-700"
                        : "text-gray-700"
                      } lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                    }
                  >
                    Profile
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
