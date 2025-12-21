import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Header from "../header/Header.jsx";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      } else if (user.role !== "admin") {
        navigate("/");
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <p className="text-center mt-10">Loading admin panel...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* MAIN WEBSITE NAVBAR */}
      <Header />

      <div className="flex flex-1 relative">
        {/* MOBILE OVERLAY */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`
            fixed md:static top-0 left-0 z-50
            h-full md:h-auto
            w-72 bg-white shadow-xl border-r border-gray-200
            flex flex-col
            transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
          `}
        >
          {/* ADMIN TITLE */}
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text">
              Admin Panel
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Manage platform content & users
            </p>
          </div>

          <nav className="p-4 flex flex-col gap-2 flex-1">
            <NavLink
              to="/admin"
              end
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium text-sm ${
                  isActive
                    ? "bg-orange-500 text-white shadow"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/courses"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium text-sm ${
                  isActive
                    ? "bg-orange-500 text-white shadow"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Manage Courses
            </NavLink>

            <NavLink
              to="/admin/users"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium text-sm ${
                  isActive
                    ? "bg-orange-500 text-white shadow"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Manage Users
            </NavLink>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 w-full">
          {/* MOBILE TOGGLE BUTTON */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden mb-4 px-4 py-2 bg-orange-500 text-white rounded-lg shadow"
          >
            ☰ Menu
          </button>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
