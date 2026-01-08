import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCourseBySlug,
  getProgress,
  markLessonComplete,
  enrollCourse
} from "../../api/courses.js";

function getYouTubeEmbedUrl(youtubeUrl) {
  try {
    const url = new URL(youtubeUrl);
    if (url.hostname.includes("youtube.com")) {
      const videoId = url.searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.hostname.includes("youtu.be")) {
      const videoId = url.pathname.slice(1);
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return youtubeUrl;
  } catch {
    return youtubeUrl;
  }
}

export default function CourseDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      try {
        setLoading(true);

        const res = await getCourseBySlug(slug);
        if (!res.data.success) {
          setCourse(null);
          setIsEnrolled(false);
          return;
        }

        setCourse(res.data.course);
        setIsEnrolled(res.data.isEnrolled);

        if (res.data.isEnrolled) {
          const prog = await getProgress(slug);
          if (prog?.data?.success) {
            setCompletedLessons(prog.data.completedLessons || []);
          }
        } else {
          setCompletedLessons([]);
        }
      } catch (err) {
        console.error("Error loading course:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg shadow-blue-500/25 animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-700">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4">
        <div className="card p-8 text-center max-w-md">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Course not found</h2>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/courses")}
            className="btn-primary"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  const lessons = course.lessons || [];
  const currentLesson = lessons[currentLessonIndex] || {};
  const isCompleted = completedLessons.some((l) => l.lessonSlug === currentLesson.slug);
  const progressPercent = isEnrolled && lessons.length > 0
    ? Math.round((completedLessons.length / lessons.length) * 100)
    : 0;

  const handleEnroll = async () => {
    try {
      setEnrollLoading(true);
      const res = await enrollCourse(slug);

      if (res.data.success) {
        setIsEnrolled(true);
        const progressRes = await getProgress(slug);
        if (progressRes.data.success) {
          setCompletedLessons(progressRes.data.completedLessons || []);
        }
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("Enroll failed:", err);
      alert("Enrollment failed");
    } finally {
      setEnrollLoading(false);
    }
  };

  const handleToggleComplete = async () => {
    if (!isEnrolled) return alert("Please enroll to mark lessons.");

    try {
      const res = await markLessonComplete(slug, currentLessonIndex);
      if (res.data.success) {
        setCompletedLessons(res.data.completedLessons);
      }
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  return (
    <div className="min-h-screen w-full animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Courses
        </button>

        {/* Course Header */}
        <div className="card bg-white/80 backdrop-blur-xl border border-gray-200/50 p-8 mb-6 animate-slideUp">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold">
                  {course.category}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {lessons.length} lessons
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {course.title}
              </h1>
              <p className="text-gray-600 text-lg">
                {course.description}
              </p>
            </div>

            {!isEnrolled && (
              <button
                onClick={handleEnroll}
                disabled={enrollLoading}
                className="btn-primary lg:min-w-[200px]"
              >
                {enrollLoading ? "Enrolling..." : "Enroll Now"}
              </button>
            )}
          </div>

          {/* Progress Bar */}
          {isEnrolled && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm font-semibold text-gray-700 mb-2">
                <span>Your Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {completedLessons.length} of {lessons.length} lessons completed
              </p>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card bg-white/80 backdrop-blur-xl border border-gray-200/50 p-6 animate-slideUp" style={{animationDelay: '0.1s'}}>
              {/* Video Container */}
              <div className="relative w-full pb-[56.25%] bg-gray-900 rounded-xl overflow-hidden mb-6 shadow-lg">
                {isEnrolled ? (
                  <iframe
                    src={getYouTubeEmbedUrl(currentLesson.youtubeUrl)}
                    className="absolute top-0 left-0 w-full h-full"
                    allowFullScreen
                    title={currentLesson.title}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
                    <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-4">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Enroll to watch</h3>
                    <p className="text-gray-300 text-center">
                      Get access to all lessons and track your progress
                    </p>
                  </div>
                )}
              </div>

              {/* Lesson Info */}
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {currentLesson.title}
                  </h2>
                  {isCompleted && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-semibold flex-shrink-0">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Completed
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  Lesson {currentLessonIndex + 1} of {lessons.length}
                </p>
              </div>

              {/* Action Button */}
              {isEnrolled && (
                <button
                  onClick={handleToggleComplete}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                    isCompleted
                      ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25"
                  }`}
                >
                  {isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
                </button>
              )}
            </div>
          </div>

          {/* Lessons Sidebar */}
          <div className="lg:col-span-1">
            <div className="card bg-white/80 backdrop-blur-xl border border-gray-200/50 p-6 animate-slideUp sticky top-6" style={{animationDelay: '0.2s'}}>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Course Lessons
              </h3>

              <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
                {lessons.map((lesson, idx) => {
                  const active = idx === currentLessonIndex;
                  const completed = completedLessons.some((c) => c.lessonSlug === lesson.slug);

                  return (
                    <button
                      key={lesson.slug}
                      onClick={() => {
                        if (!isEnrolled) {
                          alert("Please enroll to access lessons.");
                          return;
                        }
                        setCurrentLessonIndex(idx);
                      }}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all group ${
                        active
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : completed
                          ? "border-green-200 bg-green-50 hover:border-green-300"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold ${
                              active ? "text-blue-600" : "text-gray-500"
                            }`}>
                              Lesson {idx + 1}
                            </span>
                          </div>
                          <h4 className={`font-semibold text-sm line-clamp-2 ${
                            active ? "text-blue-900" : "text-gray-800"
                          }`}>
                            {lesson.title}
                          </h4>
                        </div>

                        {completed && (
                          <div className="flex-shrink-0">
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}

                        {!completed && !isEnrolled && (
                          <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}