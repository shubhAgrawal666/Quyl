import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminCourses, deleteCourse } from "../../api/admin";

export default function CoursesList() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await getAdminCourses();
        if (res.data.success) setCourses(res.data.courses);
      } catch (err) {
        console.error("Admin courses error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  const handleDelete = async (slug) => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;

    try {
      const res = await deleteCourse(slug);
      if (res.data.success) {
        alert("Course deleted successfully!");
        setCourses((prev) => prev.filter((c) => c.slug !== slug));
      } else {
        alert(res.data.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server error deleting course");
    }
  };

  const categories = Array.from(new Set(courses.map((c) => c.category)));

  const filtered = courses.filter((c) => {
    if (filter !== "all" && c.category !== filter) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg shadow-blue-500/25 animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-700">Loading courses...</p>
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
            Manage Courses
          </h1>
          <p className="text-gray-600 mt-1">
            Create, edit, and manage all platform courses
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/courses/new")}
          className="btn-primary group"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Course
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses by title or description..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:w-56"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filtered.length} of {courses.length} courses
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((course, idx) => (
          <div
            key={course._id}
            className="card p-6 hover:shadow-xl transition-all group animate-slideUp"
            style={{animationDelay: `${idx * 0.05}s`}}
          >
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-40 sm:h-32 w-full sm:w-40 object-cover rounded-xl shadow-sm flex-shrink-0"
                />
                <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700">
                  {course.lessons.length} lessons
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-lg text-gray-800 line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {course.title}
                </h2>

                <div className="flex flex-wrap items-center gap-2 mt-2 mb-3">
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                    {course.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {course.studentsEnrolled?.length || 0} enrolled
                  </span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {course.description}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate(`/admin/courses/${course.slug}/edit`)}
                className="flex-1 sm:flex-none px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 font-medium rounded-xl transition-all border border-green-200"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </span>
              </button>

              <button
                onClick={() => navigate(`/courses/${course.slug}`)}
                className="flex-1 sm:flex-none px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-xl transition-all border border-blue-200"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </span>
              </button>

              <button
                onClick={() => handleDelete(course.slug)}
                className="flex-1 sm:flex-none px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-xl transition-all border border-red-200"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No courses found</h3>
          <p className="text-gray-600 mb-6">
            {query || filter !== "all" 
              ? "Try adjusting your search or filters" 
              : "Get started by creating your first course"}
          </p>
          {!query && filter === "all" && (
            <button
              onClick={() => navigate("/admin/courses/new")}
              className="btn-primary"
            >
              Create Your First Course
            </button>
          )}
        </div>
      )}
    </div>
  );
}