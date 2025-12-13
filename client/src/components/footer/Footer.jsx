// src/components/footer/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
export default function Footer() {
    const {isAuthenticated}=useAuth();
  return (
    <footer className="bg-[#1F2937] text-gray-300 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white">Quyl</h2>
          <p className="text-gray-400 mt-3 text-sm">  
            Your journey to excellence starts here.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-orange-400">Home</Link></li>
            <li><Link to="/courses" className="hover:text-orange-400">All Courses</Link></li>
            {isAuthenticated && <>
                <li><Link to="/my-courses" className="hover:text-orange-400">My Courses</Link></li>
                <li><Link to="/profile" className="hover:text-orange-400">Profile</Link></li>
            </>}
            {!isAuthenticated && <>
                <li><Link to="/signup" className="hover:text-orange-400">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-orange-400">Login</Link></li>
            </>}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: <span className="hover:text-orange-400">quyl.feedback1@gmail.com</span></li>
            <li>Address: Raipur, India</li>
          </ul>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4 text-xl">
            <a href="#" className="hover:text-orange-400"><i className="ri-instagram-line"></i></a>
            <a href="#" className="hover:text-orange-400"><i className="ri-twitter-x-line"></i></a>
            <a href="#" className="hover:text-orange-400"><i className="ri-facebook-fill"></i></a>
            <a href="#" className="hover:text-orange-400"><i className="ri-linkedin-fill"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
