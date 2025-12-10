// src/components/admin/CoursesList.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import dummyCourses from "../../data/dummyCourses";

export default function CoursesList() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const categories = Array.from(new Set(dummyCourses.map(c => c.category)));

  const filtered = dummyCourses.filter(c => {
    if (filter !== "all" && c.category !== filter) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      (c.description || "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Courses</h1>
          <p className="text-gray-500 text-sm mt-1">Review, update and manage all courses</p>
        </div>

        {/* BUTTON */}
        <button
          onClick={() => navigate("/admin/courses/new")}
          className="px-4 py-2 bg-orange-500 text-white shadow rounded-lg hover:bg-orange-600"
        >
          + New Course
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex items-center gap-4 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses..."
          className="px-4 py-2 border rounded-lg w-64 text-sm"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg text-sm"
        >
          <option value="all">All categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* COURSE LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map(course => (
          <div
            key={course._id}
            className="bg-white border rounded-2xl shadow-md hover:shadow-lg transition p-5"
          >
            {/* TOP SECTION */}
            <div className="flex gap-4">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="h-32 w-40 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h2 className="font-semibold text-lg">{course.title}</h2>

                <div className="mt-1 flex items-center gap-2">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                    {course.category}
                  </span>
                  <span className="text-xs text-gray-500">{course.lessons.length} lessons</span>
                </div>

                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                  {course.description}
                </p>

                {/* Stats */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-gray-500 text-sm">
                    👥 {course.students} enrolled
                  </span>
                  <span className="text-yellow-500 font-semibold">{course.rating} ★</span>
                </div>
              </div>
            </div>

            {/* VIDEO THUMBNAIL PREVIEW */}
            <div className="mt-5 border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Video Preview</p>

              <div className="grid grid-cols-3 gap-3">
                {course.lessons.slice(0, 3).map(video => (
                  <div key={video.id} className="text-xs">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="h-20 w-full object-cover rounded-md"
                    />
                    <p className="mt-1 font-medium truncate">{video.title}</p>
                    <p className="text-gray-500 truncate">{video.creator}</p>
                  </div>
                ))}
              </div>

              {course.lessons.length > 3 && (
                <p className="text-xs text-gray-400 mt-1">
                  + {course.lessons.length - 3} more videos
                </p>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-5 flex items-center justify-between">
              <button
                onClick={() => navigate(`/admin/courses/${course._id}/edit`)}
                className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200"
              >
                Edit
              </button>

              <button
                onClick={() => alert("Dummy delete")}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                Delete
              </button>

              <button
                onClick={() => navigate(`/courses/${course._id}`)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-gray-500 mt-6">
          No courses found.
        </div>
      )}
    </div>
  );
}
