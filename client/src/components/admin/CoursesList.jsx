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
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const res = await deleteCourse(slug);
      if (res.data.success) {
        alert("Course deleted!");
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

  if (loading)
    return <p className="text-center mt-10">Loading courses...</p>;

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manage Courses
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Review, edit and manage all courses
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/courses/new")}
          className="w-full sm:w-auto px-4 py-2 bg-orange-500 text-white shadow rounded-lg hover:bg-orange-600"
        >
          + New Course
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses..."
          className="px-4 py-2 border rounded-lg w-full sm:w-64 text-sm"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg text-sm w-full sm:w-auto"
        >
          <option value="all">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* COURSE CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((course) => (
          <div
            key={course._id}
            className="bg-white border rounded-2xl shadow-md hover:shadow-lg transition p-5"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="h-40 sm:h-32 w-full sm:w-40 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h2 className="font-semibold text-lg">
                  {course.title}
                </h2>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                    {course.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {course.lessons.length} lessons
                  </span>
                </div>

                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                  {course.description}
                </p>

                <div className="mt-3 text-gray-500 text-sm">
                  👥 {course.studentsEnrolled?.length || 0} enrolled
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:justify-between">
              <button
                onClick={() =>
                  navigate(`/admin/courses/${course.slug}/edit`)
                }
                className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(course.slug)}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                Delete
              </button>

              <button
                onClick={() => navigate(`/courses/${course.slug}`)}
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
