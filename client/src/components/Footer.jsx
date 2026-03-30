import React from "react";

const Footer = () => {
  return (
    <footer
      className="
      flex flex-wrap justify-center lg:justify-between
      gap-10 md:gap-20 py-16 px-6 md:px-16 lg:px-24 xl:px-32
      text-[13px]

      text-gray-600 dark:text-gray-400

      bg-linear-to-r
      from-white via-indigo-100/60 to-white
      dark:from-gray-900 dark:via-gray-900 dark:to-gray-900

      backdrop-blur-md
      dark:shadow-lg dark:shadow-indigo-900/20

      border-t border-gray-200 dark:border-gray-800
      mt-40
    "
    >
      <div className="flex flex-wrap items-start gap-10 md:gap-15 xl:gap-35">

        {/* 🔥 LOGO */}
        <a href="#">
          <img
            src="/logo.png"
            alt="Jobify AI logo"
            className="h-16 md:h-16 lg:h-16 w-auto object-contain"
          />
        </a>

        {/* 🔹 Product */}
        <div>
          <p className="text-slate-800 dark:text-gray-200 font-semibold">
            Product
          </p>
          <ul className="mt-2 space-y-2">
            {["Home", "Support", "Pricing", "Affiliate"].map((item) => (
              <li key={item}>
                <a
                  href="/"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 🔹 Resources */}
        <div>
          <p className="text-slate-800 dark:text-gray-200 font-semibold">
            Resources
          </p>
          <ul className="mt-2 space-y-2">
            <li><a href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Company</a></li>
            <li><a href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Blogs</a></li>
            <li><a href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Community</a></li>
            <li>
              <a href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Careers
                <span className="text-xs text-white bg-indigo-600 dark:bg-indigo-500 rounded-md ml-2 px-2 py-1">
                  We’re hiring!
                </span>
              </a>
            </li>
            <li><a href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">About</a></li>
          </ul>
        </div>

        {/* 🔹 Legal */}
        <div>
          <p className="text-slate-800 dark:text-gray-200 font-semibold">
            Legal
          </p>
          <ul className="mt-2 space-y-2">
            <li><a href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Privacy</a></li>
            <li><a href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Terms</a></li>
          </ul>
        </div>
      </div>

      {/* 🔹 Right Section */}
      <div className="flex flex-col max-md:items-center max-md:text-center gap-2 items-end">
        <p className="max-w-60">
          Smart job matching powered by AI — built for real career growth.
        </p>

        {/* 🔥 SOCIAL ICONS (RESTORED + IMPROVED) */}
        <div className="flex items-center gap-4 mt-3 text-gray-500 dark:text-gray-400">

          {/* Twitter */}
          <a href="https://x.com/" target="_blank" rel="noreferrer">
            <svg
              className="size-5 hover:text-indigo-500 transition"
              fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
            </svg>
          </a>

          {/* LinkedIn */}
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            <svg
              className="size-5 hover:text-indigo-500 transition"
              fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect width="4" height="12" x="2" y="9"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>

          {/* YouTube */}
          <a href="https://youtube.com" target="_blank" rel="noreferrer">
            <svg
              className="size-6 hover:text-indigo-500 transition"
              fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
              <path d="m10 15 5-3-5-3z"/>
            </svg>
          </a>

        </div>

        {/* 🔹 Copyright */}
        <p className="mt-3 text-center text-gray-500 dark:text-gray-400">
          © 2026 Jobify AI
        </p>
      </div>
    </footer>
  );
};

export default Footer;