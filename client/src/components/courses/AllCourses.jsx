import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  enrollCourse,
  getAllCourses,
  getEnrolledCourses,
} from "../../api/courses.js";
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
    async function loadData() {
      try {
        const allRes = await getAllCourses();
        if (allRes.data.success) setCourses(allRes.data.courses);

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
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
          <p className="text-gray-600 font-medium">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Explore our <span className="gradient-text">courses</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Choose from our library of expert-led courses and start building your skills today
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <svg 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-full focus:border-blue-600 focus:outline-none transition-colors"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-6 py-3 bg-white border-2 border-gray-200 rounded-full focus:border-blue-600 focus:outline-none transition-colors font-medium text-gray-700"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "All" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No courses found</h2>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course, index) => {
            const alreadyEnrolled = enrolledSlugs.has(course.slug);

            return (
              <div
                key={course._id}
                className="bg-gray-100 group card overflow-hidden hover:scale-[1.02] transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-6xl">
                      📚
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-900">
                      {course.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h2>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span>{course.lessons?.length || 0} lessons</span>
                    </div>
                    {course.studentsEnrolled && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>{course.studentsEnrolled.length || 0} enrolled</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => navigate(`/courses/${course.slug}`)}
                      className="w-full px-4 py-2 bg-purple-700 text-white rounded-full font-medium hover:bg-purple-900 transition-colors"
                    >
                      View Details
                    </button>

                    {isAuthenticated ? (
                      alreadyEnrolled ? (
                        <div className="w-full px-4 py-2 bg-green-50 text-green-700 rounded-full font-medium text-center text-sm flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Enrolled
                        </div>
                      ) : (
                        <button
                          onClick={async () => {
                            setEnrollingCourse(course.slug);
                            try {
                              const res = await enrollCourse(course.slug);
                              if (res.data.success) {
                                setEnrolledSlugs(new Set([...enrolledSlugs, course.slug]));
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
                          disabled={enrollingCourse === course.slug}
                          className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {enrollingCourse === course.slug ? "Enrolling..." : "Enroll Now"}
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => navigate("/login")}
                        className="w-full px-4 py-2 border-2 border-gray-200 text-gray-900 rounded-full font-medium hover:border-blue-600 hover:text-blue-600 transition-colors"
                      >
                        Login to Enroll
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}