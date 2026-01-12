import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ReactTyped } from "react-typed";
import gsap from "gsap";

const HeroSection = () => {
  const { user } = useSelector((state) => state.user);

  // GSAP Refs
  const badgeRef = useRef(null);
  const headingRef = useRef(null);
  const typedRef = useRef(null);
  const subtitleRef = useRef(null);
  const btnsRef = useRef(null);
  const adminCardRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out", duration: 1 },
    });

    tl.from(badgeRef.current, {
      opacity: 0,
      y: -20,
    })
      .from(headingRef.current, {
        opacity: 0,
        y: 40,
      })
      .from(typedRef.current, {
        opacity: 0,
        y: 20,
      })
      .from(subtitleRef.current, {
        opacity: 0,
        y: 20,
      })
      .from(btnsRef.current, {
        opacity: 0,
        scale: 0.8,
      });

    // Admin cards animation
    if (adminCardRef.current) {
      gsap.from(adminCardRef.current.children, {
        opacity: 0,
        y: 40,
        stagger: 0.2,
        duration: 0.9,
        ease: "power3.out",
      });
    }
  }, []);

  const showAdminCards = () => {
    if (user?.role === "Admin") {
      return (
        <div
          ref={adminCardRef}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl mx-auto"
        >
          {/* Manage Recruiters */}
          <Link
            to="/admin/users"
            className="bg-white shadow-lg hover:shadow-xl transition-shadow rounded-xl p-6 flex flex-col items-center text-center group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-indigo-500 mb-4 group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H2"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800">
              Manage Recruiters
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              View, add, or remove company recruiters.
            </p>
          </Link>

          {/* Manage Job Seekers */}
          <Link
            to="/admin/users"
            className="bg-white shadow-lg hover:shadow-xl transition-shadow rounded-xl p-6 flex flex-col items-center text-center group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-purple-500 mb-4 group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800">
              Manage Job Seekers
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Review or deactivate job seeker profiles.
            </p>
          </Link>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Toaster position="top-center" />

      <section
        className="relative px-6 py-20 sm:py-32 lg:px-8 bg-cover bg-center overflow-hidden font-sans"
        style={{
          backgroundImage: "url('/img/bg5.jpg')",
        }}
      >
        {/* Overlay for clarity */}
        <div className="absolute inset-0 bg-white bg-opacity-70 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
          

          {/* Heading */}
          <h1
            ref={headingRef}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading leading-tight text-gray-800"
          >
            Bridging You to Your Future
          </h1>

          {/* Animated typed text */}
          <div ref={typedRef} className="mt-2 text-2xl font-semibold text-blue-700">
            <ReactTyped
              strings={[
                "Dream Job Awaits...",
                "Find Opportunities...",
                "Grow Your Career...",
                "Start Your Journey...",
              ]}
              typeSpeed={60}
              backSpeed={30}
              loop
            />
          </div>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="mt-6 text-gray-600 text-lg max-w-2xl"
          >
            Find the career that moves you. Discover top roles across industries — 
            fast, easy, and free.
          </p>

          {/* CTAs (Job Seeker only) */}
          {user?.role === "Job Seeker" && (
            <div
              ref={btnsRef}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/resume-builder"
                className="px-6 py-3 bg-gradient-to-r from-rose-100 to-sky-200 text-black font-semibold rounded-lg shadow hover:scale-105 transition duration-300"
              >
                ✨ Build Your Resume
              </Link>

              <Link
                to="/jobs"
                className="px-6 py-3 text-black font-semibold border border-black rounded-lg shadow hover:bg-white hover:scale-105 transition duration-300"
              >
                Explore Jobs →
              </Link>
            </div>
          )}

          {/* Admin Animated Cards */}
          {showAdminCards()}
        </div>
      </section>
    </>
  );
};

export default HeroSection;
