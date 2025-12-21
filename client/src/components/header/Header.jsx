import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../logo.jpg";

export default function Header() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const profileRef = useRef(null);

  // Close profile dropdown on outside click
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

  const handleResetPassword = () => {
    navigate("/profile#reset");
    setOpenProfileMenu(false);
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-lg block py-2 duration-200 ${
      isActive ? "text-orange-700" : "text-gray-700"
    } hover:text-orange-700`;

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

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink to="/" className={navLinkClass}>Home</NavLink>

              {!isAuthenticated && (
                <NavLink to="/courses" className={navLinkClass}>
                  Explore Courses
                </NavLink>
              )}

              {isAuthenticated && (
                <>
                  <NavLink to="/my-courses" className={navLinkClass}>
                    My Courses
                  </NavLink>

                  <NavLink to="/courses" className={navLinkClass}>
                    All Courses
                  </NavLink>

                  {user?.role === "admin" && (
                    <NavLink
                      to="/admin"
                      className="text-lg text-red-700 font-semibold hover:text-red-800"
                    >
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
                  className="md:hidden text-2xl text-gray-700"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                >
                  ☰
                </button>

                {/* Auth Buttons / Profile */}
                {!isAuthenticated ? (
                  <div className="hidden sm:flex gap-2">
                    <Link
                      to="/login"
                      className="px-3 py-2 rounded-lg text-sm border border-orange-200 text-orange-700 bg-white hover:bg-orange-50"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-orange-500 to-orange-700 text-white"
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setOpenProfileMenu((p) => !p)}
                      className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100"
                    >
                      <span className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                      <span className="hidden sm:block text-sm font-medium">
                        {user?.name}
                      </span>
                    </button>

                    {openProfileMenu && (
                      <div className="absolute right-0 mt-2 w-64 bg-white border rounded-2xl shadow-lg p-4">
                        <div className="pb-3 mb-3 border-b">
                          <p className="text-sm font-semibold">{user?.name}</p>
                          <p className="text-xs text-gray-500 break-all">
                            {user?.email}
                          </p>
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
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg px-4 py-4 space-y-3">
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
              Home
            </NavLink>

            {!isAuthenticated && (
              <NavLink to="/courses" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
                Explore Courses
              </NavLink>
            )}

            {isAuthenticated && (
              <>
                <NavLink to="/my-courses" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
                  My Courses
                </NavLink>

                <NavLink to="/courses" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
                  All Courses
                </NavLink>

                {user?.role === "admin" && (
                  <NavLink to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-red-700 font-semibold">
                    Admin Panel
                  </NavLink>
                )}

                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-600 font-medium mt-2"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
