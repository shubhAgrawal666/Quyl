import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
  toggleUserVerification,
} from "../../api/admin";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadUsers() {
      try {
        const res = await getAllUsers();
        if (mounted && res?.data?.success) {
          setUsers(res.data.users || []);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load users");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadUsers();
    return () => (mounted = false);
  }, []);

  const updateLocalUser = (id, patch) =>
    setUsers((prev) =>
      prev.map((u) => (String(u._id) === String(id) ? { ...u, ...patch } : u))
    );

  const removeLocalUser = (id) =>
    setUsers((prev) => prev.filter((u) => String(u._id) !== String(id)));

  const handleDelete = async (id) => {
    if (!confirm("Delete this user permanently? This action cannot be undone.")) return;

    setActionLoadingId(id);
    try {
      const res = await deleteUser(id);
      if (res?.data?.success) {
        removeLocalUser(id);
        alert("User deleted successfully");
      } else {
        alert(res?.data?.message || "Delete failed");
      }
    } catch {
      alert("Server error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePromote = async (id) => {
    setActionLoadingId(id);
    try {
      const res = await updateUserRole({ userId: id, role: "admin" });
      if (res?.data?.success) {
        updateLocalUser(id, { role: "admin" });
        alert("User promoted to admin");
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDemote = async (id) => {
    if (!confirm("Remove admin rights from this user?")) return;

    setActionLoadingId(id);
    try {
      const res = await updateUserRole({ userId: id, role: "student" });
      if (res?.data?.success) {
        updateLocalUser(id, { role: "student" });
        alert("Admin rights removed");
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleVerification = async (id, current) => {
    setActionLoadingId(id);
    try {
      const res = await toggleUserVerification({ userId: id });
      if (res?.data?.success) {
        updateLocalUser(id, { isVerified: !current });
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = query.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg shadow-blue-500/25 animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-700">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Manage Users
          </h1>
          <p className="text-gray-600 mt-1">
            View and manage all platform users
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-3 rounded-3xl bg-white/50 backdrop-blur-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredUsers.length} of {users.length} users
      </div>

      {/* Users Grid */}
      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="card p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No users found</h3>
            <p className="text-gray-600">
              {query ? "Try adjusting your search query" : "No users registered yet"}
            </p>
          </div>
        ) : (
          filteredUsers.map((u, idx) => (
            <div
              key={u._id}
              className="card p-6 hover:shadow-xl transition-all animate-slideUp bg-white/50 backdrop-blur-xl border border-white/30"
              style={{animationDelay: `${idx * 0.03}s`}}
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md shadow-blue-500/25">
                      {u.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h2 className="text-lg font-bold text-gray-800 truncate">
                          {u.name}
                        </h2>
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                            u.role === "admin"
                              ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                        >
                          {u.role === "admin" ? "ADMIN" : "STUDENT"}
                        </span>
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                            u.isVerified
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                          }`}
                        >
                          {u.isVerified ? "✓ Verified" : "⚠ Unverified"}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 break-all mb-2">
                        {u.email}
                      </p>

                      <p className="text-xs text-gray-500">
                        Registered:{" "}
                        {u.registeredAt
                          ? new Date(u.registeredAt).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                  </div>

                  {/* Enrolled Courses */}
                  <div className="p-3 rounded-xl bg-white/30 backdrop-blur-xl border border-white/30">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-700">
                        Enrolled Courses ({u.enrolledCourses.length})
                      </span>
                    </div>

                    {u.enrolledCourses.length === 0 ? (
                      <p className="text-xs text-gray-500">No courses enrolled</p>
                    ) : (
                      <ul className="space-y-1">
                        {u.enrolledCourses.map((ec, i) => (
                          <li key={i} className="text-xs text-gray-600 flex items-center justify-between">
                            <span className="font-medium">{ec.courseTitle}</span>
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                              {ec.progress}%
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row lg:flex-col gap-2 justify-start lg:justify-center flex-shrink-0">
                  <button
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-xl transition-all border border-red-200 flex items-center gap-2"
                    disabled={actionLoadingId === u._id}
                    onClick={() => handleDelete(u._id)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {actionLoadingId === u._id ? "..." : "Remove"}
                  </button>

                  {u.role === "admin" ? (
                    <button
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition-all border border-gray-300 flex items-center gap-2"
                      disabled={actionLoadingId === u._id}
                      onClick={() => handleDemote(u._id)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6z" />
                      </svg>
                      Demote
                    </button>
                  ) : (
                    <button
                      className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-xl transition-all border border-blue-200 flex items-center gap-2"
                      disabled={actionLoadingId === u._id}
                      onClick={() => handlePromote(u._id)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Make Admin
                    </button>
                  )}

                  <button
                    className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 font-medium rounded-xl transition-all border border-green-200 flex items-center gap-2"
                    disabled={actionLoadingId === u._id}
                    onClick={() => handleToggleVerification(u._id, u.isVerified)}
                  >
                    {u.isVerified ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Unverify
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Verify
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}