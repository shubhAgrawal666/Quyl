import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../logo.jpg";

export default function Header() {
  const { isAuthenticated, user,logout, loading } = useAuth();
  const navigate = useNavigate();

  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const profileRef = useRef(null);

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

  const handleLogout = () => {
  setOpenProfileMenu(false);

  setTimeout(async () => {
    await logout();
    navigate("/");
  }, 600);
};

  const handleResetPassword = () => {
    navigate("/profile#reset");
    setOpenProfileMenu(false);
  };

  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-white/75 backdrop-blur-sm border-b border-gray-100 shadow-md">
        <div className="max-w-screen-xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-5">
              <div className="px-4 py-2 bg-white/60 backdrop-blur-md rounded-xl border border-white">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-[45px] w-[100px] object-contain"
                />
              </div>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              <ul className="flex flex-col justify-center items-center mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">

                {/* Home */}
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `text-lg block py-2 duration-200 ${
                        isActive ? "text-orange-700" : "text-gray-700"
                      } hover:text-orange-700`
                    }
                  >
                    Home
                  </NavLink>
                </li>

                {/* Explore Courses (When logged out) */}
                {!isAuthenticated && (
                  <li>
                    <NavLink
                      to="/signup"
                      className={({ isActive }) =>
                        `text-lg block py-2 duration-200 ${
                          isActive ? "text-orange-700" : "text-gray-700"
                        } hover:text-orange-700`
                      }
                    >
                      Explore Courses
                    </NavLink>
                  </li>
                )}

                {/* Authenticated Routes */}
                {isAuthenticated && (
                  <>
                    <li>
                      <NavLink
                        to="/my-courses"
                        className={({ isActive }) =>
                          `text-lg block py-2 duration-200 ${
                            isActive ? "text-orange-700" : "text-gray-700"
                          } hover:text-orange-700`
                        }
                      >
                        My Courses
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="/courses"
                        className={({ isActive }) =>
                          `text-lg block py-2 duration-200 ${
                            isActive ? "text-orange-700" : "text-gray-700"
                          } hover:text-orange-700`
                        }
                      >
                        All Courses
                      </NavLink>
                    </li>

                    {/* Admin Panel */}
                    {user?.role === "admin" && (
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

            {/* Right Section */}
            {!loading && (
              <div className="flex items-center gap-3">

                {/* If not logged in */}
                {!isAuthenticated ? (
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
                ) : (
                  /* Logged in — Profile Dropdown */
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setOpenProfileMenu((prev) => !prev)}
                      className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition-colors"
                    >
                      <span className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                      <span className="hidden sm:block text-sm font-medium text-gray-800">
                        {user?.name}
                      </span>
                    </button>

                    {/* Dropdown */}
                    {openProfileMenu && (
                      <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-lg p-4 z-50">

                        {/* User Info */}
                        <div className="pb-3 mb-3 border-b border-gray-200">
                          <p className="text-sm font-semibold text-gray-800">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500 break-all">
                            {user?.email}
                          </p>
                        </div>

                        {/* Menu Actions */}
                        <div className="flex flex-col gap-2 text-sm">
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
                )}

              </div>
            )}

          </div>
        </div>
      </nav>
    </header>
  );
}
