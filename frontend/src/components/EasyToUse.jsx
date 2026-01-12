import React from "react";
import { FaUserPlus, FaSearch, FaBriefcase } from "react-icons/fa";

const steps = [
  {
    icon: <FaUserPlus className="text-white text-2xl" />,
    title: "Create Account",
    desc: "Sign up in seconds to access job listings and hiring tools.",
    bg: "bg-teal-400",
  },
  {
    icon: <FaSearch className="text-white text-2xl" />,
    title: "Search Jobs",
    desc: "Browse thousands of jobs tailored to your skills and goals.",
    bg: "bg-teal-400",
  },
  {
    icon: <FaBriefcase className="text-white text-2xl" />,
    title: "Apply & Get Hired",
    desc: "Submit your application and land your next big opportunity.",
    bg: "bg-teal-400",
  },
];

const EasyToUseSection = () => {
  return (
    <section className="py-16 bg-gray-50 px-6 md:px-20">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-heading text-gray-800">
          Easy to Use, Designed for You
        </h2>
        <p className="mt-4 text-gray-600 text-lg">
          Whether you're a job seeker or an recruiter, Honor Freelance makes the process effortless.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center hover:shadow-md transition duration-300"
          >
            <div className={`w-14 h-14 flex items-center justify-center rounded-full mb-4 ${step.bg}`}>
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
            <p className="text-gray-600 text-sm">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EasyToUseSection;
