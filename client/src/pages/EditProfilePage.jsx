import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/auth";

import Loader from "../components/Loader";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [name, setName] = useState(user?.name || "");

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setApiError("");
    setSuccess("");

    if (!name.trim()) {
      setApiError("Name is required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.patch("/auth/profile", {
        name: name.trim(),
      });

      
      login(localStorage.getItem("token"), res.user);

      setSuccess("Profile updated successfully");

      setTimeout(() => {
        navigate("/profile", { replace: true });
      }, 1000);

    } catch (err) {
      setApiError(err?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 border border-gray-100 dark:border-gray-700">

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Edit Profile
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Update your profile information
          </p>
        </div>

        {success && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 px-3 py-2 rounded-lg">
            {success}
          </div>
        )}

        {apiError && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 px-3 py-2 rounded-lg">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>

            <input
              type="email"
              value={user?.email}
              disabled
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black font-medium flex justify-center"
          >
            {loading ? (
              <Loader size={18} />
            ) : (
              "Save Changes"
            )}
          </button>

        </form>

      </div>
    </div>
  );
};

export default EditProfilePage;