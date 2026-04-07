import { useAuth } from "../context/auth";
import { Link } from "react-router-dom";
import { Home, MessageSquare } from "lucide-react";

const ProfilePage = () => {
  const { user, logout } = useAuth();

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">

      {/* 🔹 Top Banner */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">

        {/* 🔹 LEFT (Home) */}
        <div className="w-30 flex justify-start">
          <Link
            to="/"
            className="
              p-2 rounded-full
              bg-indigo-600 text-white
              hover:bg-indigo-700
              dark:bg-indigo-500 dark:hover:bg-indigo-600
              transition flex items-center justify-center
            "
            title="Home"
          >
            <Home size={18} />
          </Link>
        </div>

        {/* 🔹 CENTER (Title) */}
        <div className="flex-1 flex justify-center">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Profile
          </h1>
        </div>

        {/* 🔹 RIGHT (Chat) */}
        <div className="w-30 flex justify-end">
          <Link
            to="/chat"
            className="
              p-2 rounded-full
              bg-green-600 text-white
              hover:bg-green-700
              dark:bg-green-500 dark:hover:bg-green-600
              transition flex items-center justify-center
            "
            title="Go to Chat"
          >
            <MessageSquare size={18} />
          </Link>
        </div>

      </div>

      {/* 🔹 Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">

        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 border border-gray-100 dark:border-gray-700 text-center">

          {/* Avatar */}
          <div className="w-20 h-20 mx-auto rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold text-gray-800 dark:text-gray-200">
            {getInitials(user?.name)}
          </div>

          {/* Info */}
          <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            {user?.name}
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {user?.email}
          </p>

          {/* Logout */}
          <button
            onClick={logout}
            className="mt-6 w-full py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-gray-900 dark:hover:bg-gray-200 transition"
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
};

export default ProfilePage;