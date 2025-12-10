// src/components/admin/AdminLayout.jsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import Header from "../header/Header.jsx"; // MAIN WEBSITE NAVBAR

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* MAIN WEBSITE NAVBAR */}
      <Header />

      <div className="flex flex-1">

        {/* SIDEBAR */}
        <aside className="w-72 bg-white shadow-xl border-r border-gray-200 flex flex-col">
          
          {/* ADMIN PANEL TITLE MOVED HERE */}
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text">
              Admin Panel
            </h1>
            <p className="text-xs text-gray-500 mt-1">Manage platform content & users</p>
          </div>

          <nav className="p-4 flex flex-col gap-2 flex-1">

            <NavLink
              to="/admin"
              end
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
        <main className="flex-1 p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
