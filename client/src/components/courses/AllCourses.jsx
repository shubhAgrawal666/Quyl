import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { enrollCourse, getAllCourses, getEnrolledCourses } from "../../api/courses.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AllCourses() {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingCourse, setEnrollingCourse] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [enrolledSlugs, setEnrolledSlugs] = useState(new Set());


  
   useEffect(() => {
  useEffect(() => {
    async function loadData() {
      try {
        const allRes = await getAllCourses();
        if (allRes.data.success) setCourses(allRes.data.courses);

        const enrolledRes = await getEnrolledCourses();
        if (enrolledRes.data.success) {
          const slugs = enrolledRes.data.courses.map((c) => c.slug);
          setEnrolledSlugs(new Set(slugs));
        if (isAuthenticated) {
          const enrolledRes = await getEnrolledCourses();
          if (enrolledRes.data.success) {
            const slugs = enrolledRes.data.courses.map((c) => c.slug);
            setEnrolledSlugs(new Set(slugs));
          }
        }
      } catch (err) {
        console.error(err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isAuthenticated]);

  const categories = ["All", ...new Set(courses.map((c) => c.category))];

  const filteredCourses = courses.filter((course) => {
    const matchSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === "All" || selectedCategory === course.category;

    return matchSearch && matchCategory;
  });

  if (loading) {
    return (
      <div className="flex justify-center mt-20 text-xl font-semibold text-gray-700">
        Loading courses...
      </div>
    );
  }

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

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Empty */}
        {filteredCourses.length === 0 && (
          <div className="mt-12 flex justify-center">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-8 py-6 text-center max-w-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">No courses found</h2>
              <p className="text-gray-600 text-sm">Try searching something else.</p>
            </div>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {filteredCourses.map((course) => {
            const alreadyEnrolled = enrolledSlugs.has(course.slug);

            return (
              <div
                key={course._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-40 w-full overflow-hidden">
                  <img src={course.thumbnail} className="h-full w-full object-cover" />
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">{course.title}</h2>
                  <p className="text-sm text-gray-600 line-clamp-3">{course.description}</p>

                  <div className="flex justify-between items-center text-xs mt-3 text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded-full font-medium">{course.category}</span>
                    <span>{course.lessons?.length || 0} lessons</span>
                  </div>

                  {/* View Button */}
                  <button
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    onClick={() => navigate(`/courses/${course.slug}`)}
                  >
                    View Course
                  </button>

                  {/* Enroll Button OR Already Enrolled */}
                  {isAuthenticated ? (
                    alreadyEnrolled ? (

                      <div className="mt-2 w-full py-2 rounded-lg font-semibold text-center bg-gray-300 text-gray-700">
                        Already Enrolled
                      </div>
                    ) : (
                      <button
                        className="mt-2 w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                        disabled={enrollingCourse === course.slug}
                        onClick={async () => {
                          setEnrollingCourse(course.slug);
                          try {
                            const res = await enrollCourse(course.slug);
                            if (res.data.success) {
                              alert("Course Enrolled Successfully");
                              navigate(`/courses/${course.slug}`);
                            } else {
                              alert(res.data.message);
                            }
                          } catch {
                            alert("Enrollment failed");
                          } finally {
                            setEnrollingCourse(null);
                          }
                        }}
                      >
                        {enrollingCourse === course.slug ? "Enrolling..." : "Enroll Now"}
                      </button>
                    )
                  ) : (<button
                    className="mt-2 w-full border py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-100"
                    onClick={() => navigate("/login")}
                  >
                    Login to Enroll
                  </button>)
                  }
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
