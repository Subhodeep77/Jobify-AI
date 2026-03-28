import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import { loginSchema } from "../schemas/auth.schema";
import { validateWithZod } from "../utils/validateWithZod";

import PasswordInput from "../components/PasswordInput";
import { useAuth } from "../context/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // 🔐 Context-based auth

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

    // Clear field error
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

      // 🔐 Use Auth Context instead of localStorage
      login(res.token, res.user);

      // 🚀 Redirect
      navigate("/");
    } catch (err) {
      setApiError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-100">

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Login to continue
          </p>
        </div>

        {/* API Error */}
        {apiError && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
            {apiError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black/10 ${
                errors.email ? "border-red-400" : "border-gray-300"
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
            className="w-full py-2.5 rounded-lg bg-black text-white font-medium hover:bg-gray-900 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;