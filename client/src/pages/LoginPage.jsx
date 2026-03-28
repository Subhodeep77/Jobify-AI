import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import { loginSchema } from "../schemas/auth.schema";
import { validateWithZod } from "../utils/validateWithZod";

import PasswordInput from "../components/PasswordInput";
import { useAuth } from "../context/auth";
import Loader from "../components/Loader";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Handle Input
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

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setApiError("");

    const { success, errors: validationErrors } = validateWithZod(
      loginSchema,
      form
    );

    if (!success) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", form);

      login(res.token, res.user);
      navigate("/");
    } catch (err) {
      setApiError(err?.message || "Login failed");
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
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Login to continue
          </p>
        </div>

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

          {/* Password */}
          <PasswordInput
            name="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-gray-900 dark:hover:bg-gray-200 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <Loader size={18} className="text-white dark:text-black" />
            ) : (
              "Login"
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;