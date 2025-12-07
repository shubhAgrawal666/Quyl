import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { logoutUser } from "../../api/auth.js";
import { useAuth } from "../../context/AuthContext";
import logo from "../logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
export default function Header() {
  const { isAuthenticated, userRole, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "username", email: "email" });
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const profileRef = useRef(null);

  // Load user (assuming you stored it in localStorage after login)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleResetPassword = () => {
    // if your reset password UI is inside /profile (e.g. scroll or anchor)
    navigate("/profile#reset");
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
                      `text-lg block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"
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
                        `text-lg block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"
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
                          `text-lg block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"
                          } hover:text-orange-700 lg:p-0`
                        }
                      >
                        My Courses
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="/courses"
                        className={({ isActive }) =>
                          `text-lg block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"
                          } hover:text-orange-700 lg:p-0`
                        }
                      >
                        All Courses
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
                  <>
                    {/* Profile dropdown */}
                    <div className="relative" ref={profileRef}>
                      <button
                        onClick={() => setOpenProfileMenu((prev) => !prev)}
                        className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition-colors"
                      >
                        <span className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </span>
                        <span className="hidden sm:block text-sm font-medium text-gray-800">
                          {user?.name || "Profile"}
                        </span>
                      </button>

                      {openProfileMenu && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-lg p-3 z-50">
                          {/* User info */}
                          <div className="pb-3 mb-3 border-b border-gray-200">
                            <p className="text-sm font-semibold text-gray-800">
                              {user?.name || "Username"}
                            </p>
                            <p className="text-xs text-gray-500 break-all">
                              {user?.email || "email@example.com"}
                            </p>
                          </div>

                          {/* Menu actions */}
                          <div className="flex flex-col gap-2 text-sm">
                            <div>
                              <label className="font-semibold text-gray-700">Username</label>
                              <input
                                type="text"
                                value={user.name}
                                readOnly
                                className="mt-1 rounded-lg border border-gray-300 w-full p-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                              />
                            </div>

                            <div>
                              <label className="font-semibold text-gray-700">Email</label>
                              <input
                                type="email"
                                value={user.email}
                                readOnly
                                className="mt-1 rounded-lg border border-gray-300 w-full p-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                              />
                            </div>

                            <button
                              onClick={handleResetPassword}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
                            >
                              Reset password
                            </button>

                            <button
                              onClick={handleLogout}
                              className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
                            >
                              Logout
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>

                )}
              </div>
            )}

          </div>
        </div>
      </nav>
    </header>
  );
}
//  <FontAwesomeIcon icon={faUser} size="2x"  />