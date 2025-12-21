import React, { useEffect, useState } from "react";
import {
  getDashboardStats,
  getAdminCourses,
  getAllUsers,
} from "../../api/admin";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [statsRes, coursesRes] = await Promise.all([
          getDashboardStats(),
          getAdminCourses(),
          getAllUsers(),
        ]);

        setStats(statsRes.data);
        setCourses(coursesRes.data.courses || []);
      } catch (err) {
        console.error("ADMIN DASHBOARD ERROR:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading || !stats)
    return <p className="text-center mt-10">Loading dashboard...</p>;

  const { totalUsers, totalAdmins, totalStudents, totalEnrollments } = stats;

  return (
    <div className="w-full px-4 sm:px-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome back, Admin 👋
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Overview of platform activity and quick actions
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => (window.location.href = "/admin/courses/new")}
            className="w-full sm:w-auto px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600"
          >
            ➕ New Course
          </button>
          <button
            onClick={() => (window.location.href = "/admin/users")}
            className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Manage Users
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white rounded-2xl shadow-sm border">
          <p className="text-sm text-gray-500">Total Courses</p>
          <div className="mt-3 flex items-baseline gap-3">
            <div className="text-3xl font-bold text-orange-600">
              {courses.length}
            </div>
            <div className="text-xs text-gray-400">live</div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-sm border">
          <p className="text-sm text-gray-500">Total Enrollments</p>
          <div className="mt-3 text-3xl font-bold text-green-600">
            {totalEnrollments}
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-sm border">
          <p className="text-sm text-gray-500">Total Users</p>
          <div className="mt-3 text-3xl font-bold text-blue-600">
            {totalUsers}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Admins: {totalAdmins} • Students: {totalStudents}
          </p>
        </div>
      </div>

      {/* RECENT COURSES + USER DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT COURSES */}
        <section className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h2 className="text-lg font-semibold">Recent Courses</h2>
            <a
              className="text-sm text-orange-600 hover:underline"
              href="/admin/courses"
            >
              View all courses
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courses.slice(0, 4).map((c) => (
              <div
                key={c._id}
                className="flex gap-4 items-start"
              >
                <img
                  src={c.thumbnail}
                  alt={c.title}
                  className="h-24 w-32 object-cover rounded-md"
                />

                <div className="flex-1">
                  <div className="font-semibold line-clamp-1">
                    {c.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {c.category} • {c.lessons.length || 0} lessons
                  </div>

                  <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {c.description}
                  </div>
                </div>

                <div className="text-right text-xs sm:text-sm text-gray-500">
                  {c.studentsEnrolled?.length || 0} enrolled
                </div>
              </div>
            ))}
          </div>

          {courses.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              No courses found in database.
            </p>
          )}
        </section>

        {/* USER DISTRIBUTION */}
        <aside className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-md font-semibold mb-3">
            User distribution
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Admins</span>
              <span className="text-lg font-bold text-orange-600">
                {totalAdmins}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Students</span>
              <span className="text-lg font-bold text-green-600">
                {totalStudents}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Users</span>
              <span className="text-lg font-bold text-gray-700">
                {totalUsers}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => (window.location.href = "/admin/users")}
              className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600"
            >
              Manage Users
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
