import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

import { resetPasswordSchema } from "../schemas/resetPassword.schema";
import { validateWithZod } from "../utils/validateWithZod";

import PasswordInput from "../components/PasswordInput";
import Loader from "../components/Loader";

const ChangePasswordPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setApiError("");
    setSuccess("");

    const { success: isValid, errors: validationErrors } =
      validateWithZod(resetPasswordSchema, {
        password: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

    if (!isValid) {
      setErrors({
        newPassword: validationErrors.password,
        confirmPassword: validationErrors.confirmPassword,
      });
      return;
    }

    try {
      setLoading(true);

      const res = await api.patch("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setSuccess(
        res?.message || "Password updated successfully. Redirecting..."
      );

      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
      }, 1500);

    } catch (err) {
      setApiError(err?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 border border-gray-100 dark:border-gray-700">

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Change Password
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Update your account password
          </p>
        </div>

        {/* Success */}
        {success && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 px-3 py-2 rounded-lg">
            {success}
          </div>
        )}

        {/* API Error */}
        {apiError && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 px-3 py-2 rounded-lg">
            {apiError}
          </div>
        )}

        {/* Form */}
        {success ? (
          <div className="text-center space-y-4">
            <div className="text-sm text-green-700 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 px-3 py-2 rounded-lg">
              ✓ {success}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">

            <PasswordInput
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              error={errors.currentPassword}
              label="Current Password"
              required
            />

            <PasswordInput
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              error={errors.newPassword}
              label="New Password"
              required
            />

            <PasswordInput
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              label="Confirm Password"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-gray-900 dark:hover:bg-gray-200 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <Loader size={18} className="text-white dark:text-black" />
              ) : (
                "Update Password"
              )}
            </button>

          </form>
        )}

        {/* Footer */}
        {!success && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
            Back to{" "}
            <Link
              to="/profile"
              className="text-black dark:text-white font-medium hover:underline"
            >
              Profile
            </Link>
          </p>
        )}

      </div>
    </div>
  );
};

export default ChangePasswordPage;