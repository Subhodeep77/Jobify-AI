import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

import { forgotPasswordSchema } from "../schemas/forgotPassword.schema";
import { validateWithZod } from "../utils/validateWithZod";

import Loader from "../components/Loader";

const ForgotPasswordPage = () => {
  const [form, setForm] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Handle Input
  const handleChange = (e) => {
    setForm({ email: e.target.value });

    setErrors({ email: "" });
    setApiError("");
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setApiError("");
    setSuccess("");

    const { success: isValid, errors: validationErrors } =
      validateWithZod(forgotPasswordSchema, form);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/forgot-password", form);

      // Backend intentionally returns generic success message
      setSuccess(
        res?.message ||
          "If this email exists, a reset link has been sent"
      );

    } catch (err) {
      setApiError(err?.message || "Something went wrong");
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
            Forgot Password
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Enter your email to receive a reset link
          </p>
        </div>

        {/* Success Message */}
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
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 
              bg-white dark:bg-gray-900 
              text-gray-900 dark:text-gray-100 
              ${
                errors.email
                  ? "border-red-400"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-gray-900 dark:hover:bg-gray-200 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <Loader size={18} className="text-white dark:text-black" />
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-black dark:text-white font-medium hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;