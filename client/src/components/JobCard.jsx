import { useState } from "react";
import clsx from "clsx";

// 🔹 Combined Fit Logic
const getFit = (match, confidence) => {
  const score = (match + confidence) / 2;

  if (score >= 0.85)
    return { label: "🟢 Excellent Fit", color: "bg-green-500" };
  if (score >= 0.7)
    return { label: "🟡 Good Fit", color: "bg-yellow-500" };
  return { label: "🔴 Weak Fit", color: "bg-red-500" };
};

// 🔹 Confidence Label (no raw numbers)
const getConfidenceLabel = (confidence) => {
  if (confidence >= 0.8) return "High";
  if (confidence >= 0.6) return "Moderate";
  return "Low";
};

const JobCard = ({ job }) => {
  const [open, setOpen] = useState(false);

  const fit = getFit(job.match_score, job.confidence_score);
  const confidenceLabel = getConfidenceLabel(job.confidence_score);

  return (
    <div className="p-4 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
            {job.role}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {job.company}
          </p>

          {/* 🔹 Confidence (subtle) */}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Confidence: {confidenceLabel}
          </p>
        </div>

        {/* Fit Badge */}
        <span
          className={clsx(
            "text-xs px-2 py-1 rounded-full text-white",
            fit.color
          )}
        >
          {fit.label}
        </span>
      </div>

      {/* Toggle */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="mt-3 text-sm text-blue-500 hover:underline"
      >
        {open ? "Hide details" : " View details"}
      </button>

      {/* Expanded */}
      {open && (
        <div className="mt-3 space-y-3 text-sm">

          {/* Why */}
          <div>
            <p className="font-medium">Why</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
              {job.why?.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>

          {/* Missing Skills */}
          <div>
            <p className="font-medium">Missing Skills</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {job.missing_skills?.map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div>
            <p className="font-medium">Next Steps</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
              {job.next_steps?.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>

        </div>
      )}

      {/* Apply */}
      <a
        href={job.apply_link || "#"}
        target="_blank"
        rel="noreferrer"
        className={clsx(
          "mt-4 inline-block text-sm font-medium",
          job.apply_link
            ? "text-blue-500 hover:underline"
            : "text-gray-400 pointer-events-none"
        )}
      >
        Apply →
      </a>
    </div>
  );
};

export default JobCard;