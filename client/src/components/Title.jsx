import React from "react";

const Title = ({ title, description }) => {
  return (
    <div className="text-center mt-6 text-slate-700 dark:text-gray-200">
      
      {/* 🔹 Title */}
      <h2 className="text-3xl sm:text-4xl font-medium tracking-tight">
        {title}
      </h2>

      {/* 🔹 Description */}
      <p className="max-w-2xl mt-4 text-slate-500 dark:text-gray-400 mx-auto">
        {description}
      </p>

    </div>
  );
};

export default Title;