
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
    if (!confirm("Delete this user permanently?")) return;

    setActionLoadingId(id);
    try {
      const res = await deleteUser(id);
      if (res?.data?.success) {
        removeLocalUser(id);
        alert("User deleted");
      } else {
        alert(res?.data?.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
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
      } else {
        alert(res?.data?.message || "Failed to promote");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setActionLoadingId(null);
    }
  };

  
  const handleDemote = async (id) => {
    if (!confirm("Remove admin rights?")) return;

    setActionLoadingId(id);

    try {
      const res = await updateUserRole({ userId: id, role: "student" });
      if (res?.data?.success) {
        updateLocalUser(id, { role: "student" });
        alert("Admin rights removed");
      } else {
        alert(res?.data?.message || "Failed to demote");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
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
      } else {
        alert(res?.data?.message || "Failed to toggle verification");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
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

  if (loading)
    return <div className="text-center py-12 text-gray-500">Loading users...</div>;

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

      {error && <div className="p-3 bg-red-50 text-red-700 rounded">{error}</div>}

      {/* Users List */}
      <div className="grid gap-6">
        {filteredUsers.length === 0 ? (
          <p className="text-center text-gray-500">No users found</p>
        ) : (
          filteredUsers.map((u) => (
            <div
              key={u._id}
              className="bg-white p-5 rounded-xl shadow border flex justify-between items-start"
            >
              {/* USER INFO */}
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

                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      u.isVerified
                        ? "bg-green-50 text-green-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {u.isVerified ? "Verified" : "Unverified"}
                  </span>
                </div>

                <p className="text-gray-500 text-sm">{u.email}</p>

                <p className="text-xs text-gray-400 mt-1">
                  Registered:{" "}
                  {u.registeredAt
                    ? new Date(u.registeredAt).toLocaleString()
                    : "-"}
                </p>

                {/* COURSES */}
                <div className="mt-3">
                  <p className="text-sm font-medium">Enrolled Courses:</p>

                  {u.enrolledCourses.length === 0 ? (
                    <p className="text-xs text-gray-500">No courses enrolled</p>
                  ) : (
                    <ul className="mt-1 space-y-1">
                      {u.enrolledCourses.map((ec, i) => (
                        <li key={i} className="text-xs">
                          <strong>{ec.courseTitle}</strong> — {ec.progress}% complete
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col gap-2 ml-4">
                {/* DELETE */}
                <button
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  disabled={actionLoadingId === u._id}
                  onClick={() => handleDelete(u._id)}
                >
                  {actionLoadingId === u._id ? "Working..." : "Remove"}
                </button>

                {/* PROMOTE/DEMOTE */}
                {u.role === "admin" ? (
                  <button
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    disabled={actionLoadingId === u._id}
                    onClick={() => handleDemote(u._id)}
                  >
                    {actionLoadingId === u._id ? "Working..." : "Remove Admin"}
                  </button>
                ) : (
                  <button
                    className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                    disabled={actionLoadingId === u._id}
                    onClick={() => handlePromote(u._id)}
                  >
                    {actionLoadingId === u._id ? "Working..." : "Make Admin"}
                  </button>
                )}

                {/* VERIFY */}
                <button
                  className="px-3 py-1 border rounded hover:bg-gray-50 text-sm"
                  disabled={actionLoadingId === u._id}
                  onClick={() =>
                    handleToggleVerification(u._id, u.isVerified)
                  }
                >
                  {actionLoadingId === u._id
                    ? "Working..."
                    : u.isVerified
                    ? "Unverify"
                    : "Verify"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
