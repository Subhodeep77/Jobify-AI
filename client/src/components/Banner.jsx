import React from "react";

const Banner = () => {
  return (
    <div
      className="
  sticky top-0 z-20
  w-full py-2.5 text-sm font-medium text-white text-center
  bg-linear-to-r from-indigo-600 to-sky-400
  dark:from-indigo-700 dark:to-indigo-900
  backdrop-blur-md
  shadow-md dark:shadow-indigo-900/30
"
    >
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
  );
};

export default Banner;
