import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../logo.svg";

export default function Header() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);
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
    setOpenProfileMenu(false);
    setMobileMenuOpen(false);
    await logout();
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 text-m font-medium rounded-full transition-all duration-200 ${isActive
      ? "text-blue-600 bg-white/70"
      : "text-gray-900 hover:text-blue-600 hover:bg-white/30"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 bg-transparent backdrop-blur-xl shadow-sm`}
    >

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="px-4 py-2 rounded-xl">
              <img
                src={logo}
                alt="Logo"
                className="h-[45px] w-[100px] object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            {!isAuthenticated && (
              <NavLink to="/courses" className={navLinkClass}>
                Courses
              </NavLink>
            )}

            {isAuthenticated && (
              <>
                <NavLink to="/my-courses" className={navLinkClass}>
                  My Courses
                </NavLink>

                <NavLink to="/courses" className={navLinkClass}>
                  Courses
                </NavLink>

                {user?.role === "admin" && (
                  <NavLink to="/admin" className={navLinkClass}>
                    Admin Panel
                  </NavLink>
                )}
              </>
            )}
          </div>

          {/* Right Section */}
          {!loading && (
            <div className="flex items-center gap-3">
              {/* Mobile Hamburger */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>

              {/* Auth Buttons / Profile */}
              {!isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-m font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-m font-medium rounded-full hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Sign up
                  </Link>
                </div>
              ) : (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setOpenProfileMenu((p) => !p)}
                    className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-white/30 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-900">
                      {user?.name}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform ${openProfileMenu ? "rotate-180" : ""
                        }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {openProfileMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-gray-100 backdrop-blur-xl rounded-3xl shadow-xl border border-purple-100 py-2 animate-scale-in">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-md font-semibold text-gray-900">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {user?.email}
                        </p>
                      </div>

                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setOpenProfileMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Profile Settings
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 animate-slide-up">
            <div className="flex flex-col gap-2">
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                Home
              </NavLink>

              {!isAuthenticated && (
                <NavLink
                  to="/courses"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  Courses
                </NavLink>
              )}

              {isAuthenticated && (
                <>
                  <NavLink
                    to="/my-courses"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    My Courses
                  </NavLink>

                  <NavLink
                    to="/courses"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    Explore
                  </NavLink>

                  {user?.role === "admin" && (
                    <NavLink
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700 hover:bg-gray-50"
                        }`
                      }
                    >
                      Admin Panel
                    </NavLink>
                  )}
                </>
              )}

              {!isAuthenticated && (
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-center text-sm font-medium text-gray-700 border-2 border-gray-200 rounded-full hover:border-blue-600 hover:text-blue-600 transition-colors"
                  >
                    Log in
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-full"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}