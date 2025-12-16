// src/components/course/CourseDetails.jsx
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

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!course) return <p className="text-center mt-10">Course not found.</p>;

  const lessons = course.lessons || [];
  const currentLesson = lessons[currentLessonIndex] || {};

  const isCompleted = completedLessons.some(
    (l) => l.lessonSlug === currentLesson.slug
  );

  const handleEnroll = async () => {
    try {
      setEnrollLoading(true);
      const res = await enrollCourse(slug);

      if (res.data.success) {
        alert("Successfully enrolled!");

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

  const progressPercent = isEnrolled
    ? Math.round((completedLessons.length / lessons.length) * 100)
    : 0;

  return (
    <div className="min-h-screen w-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-6xl px-4 py-6">

        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 mb-3 hover:underline"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {course.title}
          </h1>
          <p className="text-gray-600 mb-3">{course.description}</p>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="px-2 py-1 bg-gray-100 rounded-full">
              {course.category}
            </span>
            <span>{lessons.length} lessons</span>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 bg-blue-600 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">

          {/* VIDEO SECTION */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <div className="relative w-full pb-[56.25%] bg-black rounded-xl overflow-hidden mb-4">
              {isEnrolled ? (
                <iframe
                  src={getYouTubeEmbedUrl(currentLesson.youtubeUrl)}
                  className="absolute top-0 left-0 w-full h-full"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white text-lg font-semibold">
                  🔒 Enroll to watch this lesson
                </div>
              )}
            </div>

            <h2 className="text-xl font-semibold text-gray-800">
              {currentLesson.title}
            </h2>
            <p className="text-sm text-gray-500">
              Lesson {currentLessonIndex + 1} of {lessons.length}
            </p>

            {/* ENROLL BUTTON (ONLY IF NOT ENROLLED) */}
            {!isEnrolled && (
              <button
                onClick={handleEnroll}
                disabled={enrollLoading}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium"
              >
                {enrollLoading ? "Enrolling..." : "Enroll Now"}
              </button>
            )}

            {/* COMPLETE BUTTON (ONLY IF ENROLLED) */}
            {isEnrolled && (
              <button
                onClick={handleToggleComplete}
                className={`mt-4 px-4 py-2 rounded-lg text-sm font-semibold transition
                  ${
                    isCompleted
                      ? "bg-gray-700 text-white hover:bg-gray-800"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                {isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
              </button>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Lessons
            </h3>

            <div className="flex flex-col gap-2 max-h-[460px] overflow-y-auto">
              {lessons.map((lesson, idx) => {
                const active = idx === currentLessonIndex;
                const completed = completedLessons.some(
                  (c) => c.lessonSlug === lesson.slug
                );

                return (
                  <button
                    key={lesson.slug}
                    onClick={() => {
                      if (!isEnrolled) {
                        alert("Enroll to open lessons.");
                        return;
                      }
                      setCurrentLessonIndex(idx);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-sm flex justify-between
                      ${
                        active
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                  >
                    <span className="font-medium text-gray-800">
                      Lesson {idx + 1}: {lesson.title}
                    </span>

                    {completed && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full flex items-center justify-center">
                        Done
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
