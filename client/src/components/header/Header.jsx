import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 
import logo from "../logo.jpg";

export default function Header() {
  const { isAuthenticated, userRole, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-white/75 backdrop-blur-sm border-b border-gray-100 shadow-md">
        <div className="max-w-screen-xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">

            <Link to="/" className="flex items-center gap-5">
              <div className="px-4 py-2 bg-white/60 backdrop-blur-md rounded-xl border border-white">
                <img src={logo} alt="Logo" className="h-[45px] w-[100px] object-contain" />
              </div>
            </Link>

            <div className="hidden md:flex md:items-center md:space-x-8">
              <ul className="flex flex-col justify-center items-center mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">

                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `text-lg block py-2 pr-4 pl-3 duration-200 ${
                        isActive ? "text-orange-700" : "text-gray-700"
                      } hover:text-orange-700 lg:p-0`
                    }
                  >
                    Home
                  </NavLink>
                </li>

                {!isAuthenticated && (
                  <li>
                    <NavLink
                      to="/signup"
                      className={({ isActive }) =>
                        `text-lg block py-2 pr-4 pl-3 duration-200 ${
                          isActive ? "text-orange-700" : "text-gray-700"
                        } hover:text-orange-700 lg:p-0`
                      }
                    >
                      Explore Courses
                    </NavLink>
                  </li>
                )}

                {isAuthenticated && (
                  <>
                    <li>
                      <NavLink
                        to="/my-courses"
                        className={({ isActive }) =>
                          `text-lg block py-2 pr-4 pl-3 duration-200 ${
                            isActive ? "text-orange-700" : "text-gray-700"
                          } hover:text-orange-700 lg:p-0`
                        }
                      >
                        My Courses
                      </NavLink>
                    </li>

                    {userRole === "admin" && (
                      <li>
                        <NavLink
                          to="/admin"
                          className="text-lg text-red-700 font-semibold hover:text-red-800"
                        >
                          Admin Panel
                        </NavLink>
                      </li>
                    )}
                  </>
                )}
              </ul>
            </div>

            {!loading && (
              <div className="flex items-center gap-3">
                {!isAuthenticated && (
                  <>
                    <Link
                      to="/login"
                      className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium border border-orange-200 text-orange-700 bg-white hover:bg-orange-50 transition"
                    >
                      Log in
                    </Link>

                    <Link
                      to="/signup"
                      className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-orange-500 to-orange-700 text-white shadow-md hover:scale-[1.02] transition"
                    >
                      Sign Up
                    </Link>
                  </>
                )}

                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                  >
                    Logout
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      </nav>
    </header>
  );
}
