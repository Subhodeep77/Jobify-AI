import React from "react";

const CallToAction = () => {
  return (
    <div
      id="cta"
      className="
        w-full max-w-5xl mx-auto mt-28 px-10 sm:px-16

        border-y border-dashed 
        border-slate-200 dark:border-gray-700
      "
    >
      <div
        className="
          flex flex-col md:flex-row items-center justify-between gap-8
          text-center md:text-left

          px-3 md:px-10 py-16 sm:py-20
          -mt-10 -mb-10 w-full

          border-x border-dashed 
          border-slate-200 dark:border-gray-700

          dark:bg-gray-900/40 backdrop-blur-sm rounded-xl
        "
      >
        {/* 🔹 Text */}
        <p
          className="
            text-xl font-medium max-w-md
            text-slate-800 dark:text-gray-200
          "
        >
          Stop searching. Start matching — with AI.
        </p>

        {/* 🔹 CTA Button */}
        <a
          href="/chat"
          className="
            flex items-center gap-2
            px-8 py-3 rounded

            bg-indigo-600 hover:bg-indigo-700
            dark:bg-indigo-500 dark:hover:bg-indigo-600

            text-white transition

            shadow-md dark:shadow-indigo-900/30
          "
        >
          <span>Get Started</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4.5"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default CallToAction;