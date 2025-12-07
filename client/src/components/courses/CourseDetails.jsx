import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

// TEMPORARY DUMMY DATA – replace with backend data later
const DUMMY_COURSE = {
  _id: "1",
  title: "JavaScript Basics",
  description:
    "Learn the fundamentals of JavaScript including variables, functions, loops, and DOM manipulation.",
  thumbnail:
    "https://images.pexels.com/photos/2706379/pexels-photo-2706379.jpeg",
  category: "Programming",
  level: "Beginner",
  totalDuration: "3h 45m",
  lessons: [
    {
      _id: "l1",
      title: "Introduction to JavaScript",
      youtubeUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
      duration: "12:34",
      isPreview: true,
    },
    {
      _id: "l2",
      title: "Variables and Data Types",
      youtubeUrl: "https://www.youtube.com/watch?v=hdI2bqOjy3c",
      duration: "18:20",
    },
    {
      _id: "l3",
      title: "Functions in JavaScript",
      youtubeUrl: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
      duration: "22:10",
    },
    {
      _id: "l4",
      title: "Loops and Conditionals",
      youtubeUrl: "https://www.youtube.com/watch?v=s9wW2PpJsmQ",
      duration: "19:05",
    },
  ],
};

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
  const { courseId } = useParams(); // later use this to fetch real course
  const navigate = useNavigate();

  // For now we just use dummy data:
  const course = useMemo(() => DUMMY_COURSE, []);

  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);

  const currentLesson = course.lessons[currentLessonIndex];
  const isCompleted = completedLessons.includes(currentLesson._id);

  const handleMarkComplete = () => {
    setCompletedLessons((prev) =>
      prev.includes(currentLesson._id)
        ? prev
        : [...prev, currentLesson._id]
    );
    // Later: call backend progress API here
  };

  const handleNext = () => {
    if (currentLessonIndex < course.lessons.length - 1) {
      setCurrentLessonIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex((prev) => prev - 1);
    }
  };

  const progressPercent =
    (completedLessons.length / course.lessons.length) * 100;

  return (
    <div className="min-h-screen w-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-6xl px-4 py-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 mb-3 hover:underline"
        >
          ← Back
        </button>

        {/* Header section */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-6 mb-6 flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-wide mb-2">
              {course.title}
            </h1>
            <p className="text-gray-600 text-sm md:text-base mb-3">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-600">
              <span className="px-2 py-1 bg-gray-100 rounded-full">
                {course.category}
              </span>
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                {course.level}
              </span>
              <span>{course.lessons.length} lessons</span>
              <span>{course.totalDuration}</span>
            </div>

            {/* Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 bg-blue-600 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="w-full md:w-1/3 flex items-center justify-center">
            <div className="h-32 md:h-40 w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
                  No thumbnail
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main layout: video + lessons list */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
          {/* Video + lesson details */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-5">
            {/* Video */}
            <div className="w-full mb-4">
              <div className="relative w-full pb-[56.25%] bg-black rounded-xl overflow-hidden">
                <iframe
                  src={getYouTubeEmbedUrl(currentLesson.youtubeUrl)}
                  title={currentLesson.title}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Lesson header */}
            <div className="flex justify-between items-center mb-2">
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                  {currentLesson.title}
                </h2>
                <p className="text-sm text-gray-500">
                  Lesson {currentLessonIndex + 1} of {course.lessons.length} •{" "}
                  {currentLesson.duration}
                </p>
              </div>
              {isCompleted && (
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                  Completed
                </span>
              )}
            </div>

            {/* Controls */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={handleMarkComplete}
                className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors ${
                  isCompleted
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isCompleted ? "Completed" : "Mark as Completed"}
              </button>

              <div className="flex gap-2 ml-auto">
                <button
                  onClick={handlePrev}
                  disabled={currentLessonIndex === 0}
                  className="px-3 py-2 rounded-lg text-sm border border-gray-300 text-gray-700 disabled:opacity-40 hover:bg-gray-100"
                >
                  ← Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentLessonIndex === course.lessons.length - 1}
                  className="px-3 py-2 rounded-lg text-sm bg-gray-800 text-white disabled:opacity-40 hover:bg-gray-900"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>

          {/* Lessons sidebar */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Lessons
            </h3>

            <div className="flex flex-col gap-2 max-h-[460px] overflow-y-auto pr-1">
              {course.lessons.map((lesson, idx) => {
                const active = idx === currentLessonIndex;
                const completed = completedLessons.includes(lesson._id);

                return (
                  <button
                    key={lesson._id}
                    onClick={() => setCurrentLessonIndex(idx)}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-sm flex items-center gap-3 transition-colors ${
                      active
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex flex-col flex-1">
                      <span className="font-medium text-gray-800">
                        Lesson {idx + 1}: {lesson.title}
                      </span>
                      <span className="text-xs text-gray-500">
                        {lesson.duration}{" "}
                        {lesson.isPreview ? " • Preview" : ""}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {completed && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                          Done
                        </span>
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
  );
}
