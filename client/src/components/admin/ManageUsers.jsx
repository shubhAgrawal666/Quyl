// src/components/admin/ManageUsers.jsx

import React, { useState } from "react";
import usersData from "../../data/dummyUsers";
import dummyCourses from "../../data/dummyCourses";

export default function ManageUsers() {
  const [users, setUsers] = useState(usersData || []);
  const [query, setQuery] = useState("");

  // Safely get course title
  const getCourseTitle = (id) => {
    const course = dummyCourses.find((c) => c._id === id);
    return course ? course.title : "Unknown Course";
  };

  const handleDelete = (id) => {
    if (confirm("Remove this user? (dummy action)")) {
      setUsers((prev) => prev.filter((u) => u._id !== id));
    }
  };

  const promote = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, role: "admin" } : u))
    );
  };

  const demote = (id) => {
    const admins = users.filter((u) => u.role === "admin");
    if (admins.length <= 1) {
      alert("Cannot remove the LAST admin!");
      return;
    }

    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, role: "user" } : u))
    );
  };

  // Search filter
  const filteredUsers = users.filter((u) => {
    const q = query.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Users</h1>

        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-4 py-2 border rounded-lg text-sm shadow-sm w-64"
        />
      </div>

      {/* User List */}
      <div className="grid gap-6">
        {filteredUsers.map((u) => (
          <div
            key={u._id}
            className="bg-white p-5 rounded-xl shadow border flex justify-between items-start"
          >
            {/* USER DETAILS */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">{u.name}</h2>

                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    u.role === "admin"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {u.role.toUpperCase()}
                </span>
              </div>

              <p className="text-gray-500 text-sm">{u.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                Registered: {u.registeredAt || "-"}
              </p>

              {/* COURSES */}
              <div className="mt-3">
                <p className="text-sm font-medium">Enrolled Courses:</p>

                {!u.enrolledCourses || u.enrolledCourses.length === 0 ? (
                  <p className="text-xs text-gray-500">No courses enrolled</p>
                ) : (
                  <ul className="mt-1 space-y-1">
                    {u.enrolledCourses.map((ec, i) => (
                      <li key={i} className="text-xs">
                        <strong>{getCourseTitle(ec.courseId)}</strong> —{" "}
                        {ec.progress}% complete
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-2">
              <button
                className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                onClick={() => handleDelete(u._id)}
              >
                Remove
              </button>

              {u.role === "admin" ? (
                <button
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  onClick={() => demote(u._id)}
                >
                  Remove Admin
                </button>
              ) : (
                <button
                  className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                  onClick={() => promote(u._id)}
                >
                  Make Admin
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No users found</p>
      )}
    </div>
  );
}
