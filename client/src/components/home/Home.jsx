import React from 'react';
import Features from './features/Features.jsx';
import Category from './category/Category.jsx';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar, faPlay, faBook, faDatabase, faBrain, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";   

export default function Home() {

  const { isAuthenticated } = useAuth();  

  return (
    <>
      <div className="w-full min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-100 flex flex-col items-center px-4 py-12">
        
        {/* HERO SECTION */}
        <section className="w-full max-w-5xl text-center">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-full px-5 py-1 text-sm font-medium shadow-md">
            Start Your Learning Journey Today
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-gray-900 font-serif">
            Master Tech Skills with{" "}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Expert-Led Courses
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Unlock your potential with comprehensive recorded lectures on CS Fundamentals,
            Data Structures &amp; Algorithms, Machine Learning, and more. Track your progress
            and learn at your own pace.
          </p>
        </section>

        {/* FEATURES SECTION */}
        <section className="w-full max-w-6xl mt-24">
          <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            What Do We Provide?
          </h2>
          <p className="mt-3 text-center text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
            Everything you need to build a strong foundation and grow into an industry-ready engineer.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10 place-items-center">
            <Features
              img={faPlay}
              heading="Recorded Lectures"
              content="Access high-quality video lectures anytime, anywhere. Learn at your own pace."
            />
            <Features
              img={faChartBar}
              heading="Progress Tracking"
              content="Animated progress trackers help you visualize your learning journey."
            />
            <Features
              img={faBook}
              heading="Comprehensive Content"
              content="From basics to advanced topics, we provide everything you need."
            />
          </div>
        </section>

        {/* CATEGORY SECTION */}
        <section className="w-full max-w-6xl mt-24">
          <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            Explore by Category
          </h2>
          <p className="mt-3 text-center text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
            Choose a path that matches your goals and start learning today.
          </p>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-8 place-items-center">
            <Category img={faDatabase} heading="Programming" />
            <Category img={faDatabase} heading="Database" />
            <Category img={faBrain} heading="AI & ML" />
            <Category img={faChartBar} heading="System Design" />
          </div>
        </section>

        {/* FINAL CTA SECTION — HIDDEN IF LOGGED IN */}
        {!isAuthenticated && (
          <section className="w-full max-w-4xl mt-24">
            <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 px-6 sm:px-10 py-10 sm:py-12 text-center text-white shadow-2xl">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="mt-4 text-sm sm:text-base md:text-lg text-orange-100 max-w-2xl mx-auto">
                Join thousands of learners leveling up their skills with structured, project-driven courses.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-white text-orange-600 text-lg font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transform transition"
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                  Create Free Account
                </Link>

                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border border-orange-100 text-white text-lg font-medium bg-white/10 backdrop-blur-sm hover:bg-white/20 transition"
                >
                  Browse Courses
                </Link>
              </div>
            </div>
          </section>
        )}

      </div>
    </>
  );
}
