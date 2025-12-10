// src/components/admin/AdminDashboard.jsx
import React from "react";
import dummyCourses from "../../data/dummyCourses";
import dummyUsers from "../../data/dummyUsers";

export default function AdminDashboard() {
  const totalCourses = dummyCourses.length;
  // count unique students roughly from dummyUsers' enrolledCourses
  const totalStudents = dummyUsers.reduce(
    (acc, u) => acc + (u.enrolledCourses?.length || 0),
    0
  );
  const avgRating = (
    dummyCourses.reduce((s, c) => s + (c.rating || 0), 0) / Math.max(totalCourses, 1)
  ).toFixed(1);

  // small helper to compute completion buckets for a tiny visual
  const completions = { done: 0, inprogress: 0, none: 0 };
  dummyUsers.forEach((u) => {
    if (!u.enrolledCourses || u.enrolledCourses.length === 0) {
      completions.none++;
    } else {
      const avg = u.enrolledCourses.reduce((a, b) => a + (b.progress || 0), 0) / u.enrolledCourses.length;
      if (avg >= 100) completions.done++;
      else completions.inprogress++;
    }
  });

  return (
    <div>
      {/* header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, Admin 👋</h1>
          <p className="text-gray-500 mt-1">Overview of platform activity and quick actions</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => (window.location.href = "/admin/courses/new")}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600"
          >
            ➕ New Course
          </button>
          <button
            onClick={() => (window.location.href = "/admin/users")}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Manage Users
          </button>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white rounded-2xl shadow-sm border">
          <p className="text-sm text-gray-500">Total Courses</p>
          <div className="mt-3 flex items-baseline gap-3">
            <div className="text-3xl font-bold text-orange-600">{totalCourses}</div>
            <div className="text-xs text-gray-400">live</div>
          </div>
          <p className="mt-4 text-sm text-gray-500">Quick look at the number of published courses.</p>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-sm border">
          <p className="text-sm text-gray-500">Active Enrollments</p>
          <div className="mt-3">
            <div className="text-3xl font-bold text-green-600">{totalStudents}</div>
            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
              {/* tiny visual bar */}
              <div
                className="h-full bg-green-400 rounded-full"
                style={{ width: `${Math.min(100, (totalStudents / Math.max(1, dummyUsers.length * 3)) * 100)}%` }}
              />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">Estimated active enrollments (from dummy data).</p>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-sm border">
          <p className="text-sm text-gray-500">Average Rating</p>
          <div className="mt-3 text-3xl font-bold text-yellow-500">{avgRating}</div>
          <p className="mt-4 text-sm text-gray-500">Average rating across courses.</p>
        </div>
      </div>

      {/* recent courses and user completion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Courses</h2>
            <a className="text-sm text-orange-600 hover:underline" href="/admin/courses">View all courses</a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dummyCourses.slice(0, 4).map((c) => (
              <div key={c._id} className="flex gap-4 items-start">
                <img src={c.thumbnail} alt={c.title} className="h-24 w-32 object-cover rounded-md" />
                <div className="flex-1">
                  <div className="font-semibold">{c.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{c.category} • {c.lessons.length} lessons</div>
                  <div className="mt-2 text-sm text-gray-600 line-clamp-2">{c.description}</div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div>{c.students} students</div>
                  <div className="mt-2 text-yellow-500 font-semibold">{c.rating} ★</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-md font-semibold mb-3">User progress overview</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Completed</div>
                <div className="text-xs text-gray-500">Users with 100% progress</div>
              </div>
              <div className="text-lg font-bold text-green-600">{completions.done}</div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">In Progress</div>
                <div className="text-xs text-gray-500">Users currently learning</div>
              </div>
              <div className="text-lg font-bold text-orange-600">{completions.inprogress}</div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">No Enrollments</div>
                <div className="text-xs text-gray-500">Users with no courses</div>
              </div>
              <div className="text-lg font-bold text-gray-600">{completions.none}</div>
            </div>
          </div>

          <div className="mt-6">
            <button onClick={() => (window.location.href = "/admin/users")} className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600">
              Manage Users
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
