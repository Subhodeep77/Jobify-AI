import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";

const PasswordInput = ({
  name = "password",
  value,
  onChange,
  placeholder = "••••••••",
  error,
  label = "Password",
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={clsx(
            "w-full px-3 py-2 pr-10 border rounded-lg outline-none focus:ring-2 focus:ring-black/10",
            error ? "border-red-400" : "border-gray-300"
          )}
        />

        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label="Toggle password visibility"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;