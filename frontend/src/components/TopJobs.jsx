import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

const Banner = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const btnRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.from(sectionRef.current, {
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    })
      .from(
        titleRef.current,
        {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.5"
      )
      .from(
        subtitleRef.current,
        {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.7"
      )
      .from(
        btnRef.current,
        {
          scale: 0.8,
          opacity: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          stagger: 0.2,
        },
        "-=0.6"
      );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-cover bg-center bg-no-repeat h-[60vh] md:h-[80vh] flex items-center shadow-inner"
      style={{
        backgroundImage: "url('/img/youthjobs.webp')",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-6 text-center">
        {/* Title */}
        <h1
          ref={titleRef}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-xl"
        >
          Welcome to{" "}
          <span className="text-teal-300 font-extrabold">
            HONOR FREELANCE
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
        >
          Connect with top freelancers and find your next opportunity.
        </p>

        {/* Buttons */}
        <div
          ref={btnRef}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <Link
            to="/register"
            className="px-6 py-3 bg-teal-400 text-gray-900 font-bold rounded-lg shadow-lg 
            transform transition-all duration-300 hover:bg-teal-300 hover:scale-105 active:scale-95"
          >
            Get Started
          </Link>

          <Link
            to="/jobs"
            className="px-6 py-3 border-2 border-white text-white font-bold rounded-lg shadow-md
            transform transition-all duration-300 hover:bg-white hover:text-gray-900 hover:scale-105 active:scale-95"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Banner;
