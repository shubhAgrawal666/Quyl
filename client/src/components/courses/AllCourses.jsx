import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { enrollCourse } from "../../api/courses.js";

const DUMMY_COURSES = [
  {
    _id: "1",
    title: "JavaScript Basics",
    description: "Learn variables, functions, loops and the core JS concepts.",
    thumbnail: "https://images.pexels.com/photos/2706379/pexels-photo-2706379.jpeg",
    category: "Programming",
    lessonsCount: 15,
    level: "Beginner",
  },
  {
    _id: "2",
    title: "React for Beginners",
    description: "Build reactive UIs with components, props, state and hooks.",
    thumbnail: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg",
    category: "Frontend",
    lessonsCount: 22,
    level: "Intermediate",
  },
  {
    _id: "3",
    title: "Node & Express API",
    description: "Create REST APIs, middlewares and connect with MongoDB.",
    thumbnail: "https://images.pexels.com/photos/160107/pexels-photo-160107.jpeg",
    category: "Backend",
    lessonsCount: 18,
    level: "Intermediate",
  },
];

export default function AllCourses() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loadingEnroll, setLoadingEnroll] = useState(false);

  const filteredCourses = DUMMY_COURSES.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ["All", "Programming", "Frontend", "Backend"];

  return (
    <div className="min-h-screen w-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
              All Courses
            </h1>
            <p className="text-gray-600 mt-1">
              Browse all available courses and start learning.
            </p>
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[220px]"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* No courses case */}
        {filteredCourses.length === 0 && (
          <div className="mt-10 flex justify-center">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-8 py-6 text-center max-w-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                No courses found
              </h2>
              <p className="text-gray-600 text-sm">
                Try changing your search or filter to find more courses.
              </p>
            </div>
          </div>
        )}

        {/* Courses grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Thumbnail */}
              {course.thumbnail && (
                <div className="h-40 w-full overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-4 flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                  {course.title}
                </h2>

                <p className="text-sm text-gray-600 line-clamp-3">
                  {course.description}
                </p>

                <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                  <span className="px-2 py-1 rounded-full bg-gray-100 font-medium">
                    {course.category}
                  </span>
                  <span>{course.lessonsCount} lessons</span>
                  <span className="font-medium text-blue-600">
                    {course.level}
                  </span>
                </div>

                <button
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold tracking-wide text-sm hover:bg-blue-700 transition-colors"
                  onClick={() => navigate(`/courses/${course._id}`)}
                >
                  View Course
                </button>
                <button
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold tracking-wide text-sm hover:bg-blue-700 transition-colors"
                  disabled={loadingEnroll}
                  onClick={async () => {
                    setLoadingEnroll(true);
                      try {
                            const response = await enrollCourse(course._id);

                            if (response.data.success) {
                              alert("Course Enrolled Successfully");
                              navigate(`/courses/${course._id}`);
                            } else {
                              alert(response.data.message);
                            }
                          } catch (err) {
                            alert("Enrollment failed");
                          } finally {
                            setLoadingEnroll(false);
                          }
                      }}
                >
                {loadingEnroll ? "Enrolling..." : "Enroll Now"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
