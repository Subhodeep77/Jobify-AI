import { useAuth } from "../context/auth";

const ProfilePage = () => {
  const { user, logout } = useAuth();

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">

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
  );
};

export default ProfilePage;