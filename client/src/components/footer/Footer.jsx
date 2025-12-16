// src/components/footer/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Footer() {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-20 text-center sm:text-left">
      <div className="max-w-7xl mx-auto px-6 flex justify-between">

        {/* Brand */}
        <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white">Quyl</h2>
            <p className="text-gray-400 text-sm">
                Your journey to excellence starts here.
            </p>
        </div>

        {/* Explore */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white mb-3">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-orange-400">Home</Link></li>
            <li><Link to="/courses" className="hover:text-orange-400">All Courses</Link></li>

            {/* SHOW WHEN USER IS LOGGED IN */}
            {isAuthenticated && (
              <>
                <li>
                  <Link to="/my-courses" className="hover:text-orange-400">
                    My Courses
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="hover:text-orange-400">
                    Profile
                  </Link>
                </li>
              </>
            )}

            {/* SHOW WHEN USER IS LOGGED OUT */}
            {!isAuthenticated && (
              <>
                <li>
                  <Link to="/signup" className="hover:text-orange-400">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-orange-400">
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: <span className="hover:text-orange-400">quyl.feedback1@gmail.com</span></li>
            <li>Address: Raipur, India</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
