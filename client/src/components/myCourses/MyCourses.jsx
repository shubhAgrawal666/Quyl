import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEnrolledCourses } from "../../api/courses";

export default function MyCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getEnrolledCourses();
        if (!res.data.success) {
          setErr(res.data.message || "Failed to load courses");
          return;
        }
        setCourses(res.data.courses || []);
      } catch (error) {
        setErr(error?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  /* Loading */
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
        <p className="text-base sm:text-lg font-semibold text-gray-700">
          Loading your courses...
        </p>
      </div>
    );
  }

  /* Error */
  if (err) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-md rounded-xl px-6 py-4 border border-red-200 max-w-md w-full text-center">
          <p className="text-red-600 font-semibold mb-2">Error</p>
          <p className="text-gray-700 text-sm sm:text-base">{err}</p>
        </div>
      </div>
    );
  }

  /* Empty */
  if (courses.length === 0) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-md rounded-xl px-8 py-6 border border-gray-200 text-center max-w-md">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            No Courses Yet
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            You haven’t enrolled in any courses. Go to the courses page and start
            learning!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 flex justify-center">
      <div className="w-full max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 tracking-wide">
          My Courses
        </h1>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              {course.thumbnail && (
                <div className="h-40 w-full overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="p-4 flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                  {course.title}
                </h2>

                <p className="text-sm text-gray-600 line-clamp-3">
                  {course.description}
                </p>

                <div className="flex justify-between items-center mt-3 text-xs sm:text-sm text-gray-500">
                  <span className="px-2 py-1 rounded-full bg-gray-100 font-medium">
                    {course.category || "General"}
                  </span>
                  <span>{course.lessons?.length || 0} lessons</span>
                </div>

                <button
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold tracking-wide text-sm hover:bg-blue-700 transition-colors"
                  onClick={() => navigate(`/courses/${course.slug}`)}
                >
                  Continue Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
