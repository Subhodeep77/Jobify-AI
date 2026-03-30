import React from "react";
import { Zap } from "lucide-react";
import Title from "./Title";

const Features = () => {
  return (
    <div
      id="features"
      className="flex flex-col items-center my-10 scroll-mt-12
      text-slate-800 dark:text-gray-200"
    >
      {/* 🔹 Badge */}
      <div
        className="
        flex items-center gap-2 text-sm
        text-blue-800 bg-blue-400/10 border border-indigo-200
        dark:text-indigo-300 dark:bg-indigo-500/10 dark:border-indigo-700
        rounded-full px-6 py-1.5
      "
      >
        <Zap width={14} />
        <span>Smart AI Matching</span>
      </div>

      {/* 🔹 Title (UPDATED FOR JOBIFY AI) */}
      <Title
        title="Find jobs that fit you"
        description="Jobify AI analyzes your resume, understands your strengths, and matches you with roles that truly align — not just keywords."
      />

      {/* 🔹 Features Grid */}
      <div className="flex items-center justify-center flex-wrap gap-6 mt-20 px-4 md:px-0">

        {/* 🔹 Card 1 */}
        <div
          className="
          flex flex-col text-center items-center justify-center rounded-xl p-6 gap-6 max-w-sm
          border border-violet-200 dark:border-violet-700
          bg-white dark:bg-gray-900
          cursor-pointer hover:shadow-lg hover:-translate-y-1 transition
        "
        >
          <div className="p-6 aspect-square bg-violet-100 dark:bg-violet-900/40 rounded-full">
            {/* icon */}
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-slate-700 dark:text-gray-100">
              Smart Role Matching
            </h3>
            <p className="text-sm text-slate-600 dark:text-gray-400">
              AI understands your skills and suggests roles tailored to your profile.
            </p>
          </div>
        </div>

        {/* 🔹 Card 2 */}
        <div
          className="
          flex flex-col text-center items-center justify-center rounded-xl p-6 gap-6 max-w-sm
          border border-green-200 dark:border-green-700
          bg-white dark:bg-gray-900
          cursor-pointer hover:shadow-lg hover:-translate-y-1 transition
        "
        >
          <div className="p-6 aspect-square bg-green-100 dark:bg-green-900/40 rounded-full">
            {/* icon */}
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-slate-700 dark:text-gray-100">
              Resume Intelligence
            </h3>
            <p className="text-sm text-slate-600 dark:text-gray-400">
              Extract insights from your resume and get actionable recommendations instantly.
            </p>
          </div>
        </div>

        {/* 🔹 Card 3 */}
        <div
          className="
          flex flex-col text-center items-center justify-center rounded-xl p-6 gap-6 max-w-sm
          border border-orange-200 dark:border-orange-700
          bg-white dark:bg-gray-900
          cursor-pointer hover:shadow-lg hover:-translate-y-1 transition
        "
        >
          <div className="p-6 aspect-square bg-orange-100 dark:bg-orange-900/40 rounded-full">
            {/* icon */}
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-slate-700 dark:text-gray-100">
              Actionable Career Insights
            </h3>
            <p className="text-sm text-slate-600 dark:text-gray-400">
              Identify missing skills, improve your profile, and boost your job readiness.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Features;