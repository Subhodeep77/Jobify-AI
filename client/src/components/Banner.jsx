import React from "react";
import ThemeToggle from "./ThemeToggle";

const Banner = () => {
  return (
    <div
      className="
        sticky top-0 z-20
        w-full py-2.5 px-4
        text-sm font-medium text-white
        bg-linear-to-r from-indigo-600 to-sky-400
        dark:from-indigo-700 dark:to-indigo-900
        backdrop-blur-md
        shadow-md dark:shadow-indigo-900/30
        flex items-center justify-between
      "
    >
      {/* 🔹 LEFT (empty for balance) */}
      <div className="w-25" />

      {/* 🔹 CENTER (perfectly centered text) */}
      <div className="absolute left-1/2 -translate-x-1/2 text-center">
        <p>
          <span
            className="
              px-3 py-1 rounded-md mr-2
              bg-white text-indigo-600
              dark:bg-gray-800 dark:text-indigo-300
            "
          >
            New
          </span>
          AI Feature Added
        </p>
      </div>

      {/* 🔹 RIGHT (Theme Toggle) */}
      <div className="flex justify-end w-25">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Banner;