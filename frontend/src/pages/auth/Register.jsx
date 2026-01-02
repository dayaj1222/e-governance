import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import Select from "react-select";
import APP_CONFIG from "../../config/app.config";
import {
  Mail,
  Lock,
  User,
  Building,
  AlertCircle,
  Loader,
  Eye,
  EyeOff,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    type: "citizen",
    city: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      const path =
        user?.type === "citizen"
          ? "/citizen/dashboard"
          : "/authority/dashboard";
      navigate(path, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value) return "Name is required";
        if (value.length < 2) return "Name must be at least 2 characters";
        return "";
      case "email":
        if (!value) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Email is invalid";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return "";
      case "city":
        if (formData.type === "authority" && !value)
          return "City is required for authorities";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    if (errors.form) {
      setErrors({ ...errors, form: "" });
    }

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }

    // Revalidate confirmPassword if password changes
    if (name === "password" && touched.confirmPassword) {
      const confirmError =
        formData.confirmPassword !== value ? "Passwords do not match" : "";
      setErrors({ ...errors, confirmPassword: confirmError });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key === "city" && formData.type === "citizen") return; // Skip city for citizens
      if (key === "confirmPassword") return; // Skip confirmPassword for API
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    // Validate confirmPassword separately
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    console.log("Register clicked");

    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      city: formData.type === "authority",
    });

    if (!validateForm()) {
      console.log("Validation failed:", errors);
      toast.error("Please fix the errors");
      return;
    }

    setLoading(true);
    console.log("Attempting registration:", { ...formData, password: "***" });

    try {
      // Prepare data for API
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        type: formData.type,
      };

      if (formData.type === "authority") {
        userData.city = formData.city;
      }

      const result = await register(userData);
      console.log("Register result:", result);

      if (result.success) {
        toast.success("Registration successful!");
        const path =
          result.user.type === "citizen"
            ? "/citizen/dashboard"
            : "/authority/dashboard";
        setTimeout(() => navigate(path), 500);
      } else {
        console.error("Registration failed:", result.error);
        toast.error(result.error || "Registration failed");
        setErrors({ form: result.error });
      }
    } catch (error) {
      console.error("Registration exception:", error);
      toast.error("Something went wrong");
      setErrors({ form: "Network error. Please check your connection." });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleRegister();
    }
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      paddingLeft: "2.5rem",
      paddingTop: "0.5rem",
      paddingBottom: "0.5rem",
      borderColor:
        errors.city && touched.city
          ? "#EF4444"
          : state.isFocused
            ? APP_CONFIG.colors.primary
            : "#D1D5DB",
      boxShadow: state.isFocused
        ? `0 0 0 3px ${APP_CONFIG.colors.primary}15`
        : "none",
      "&:hover": {
        borderColor: state.isFocused ? APP_CONFIG.colors.primary : "#9CA3AF",
      },
      cursor: "pointer",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? APP_CONFIG.colors.primary
        : state.isFocused
          ? `${APP_CONFIG.colors.primary}15`
          : "white",
      color: state.isSelected ? "white" : "#111827",
      cursor: "pointer",
      "&:active": {
        backgroundColor: APP_CONFIG.colors.primaryDark,
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9CA3AF",
    }),
  };

  const cityOptions = APP_CONFIG.cities.map((city) => ({
    value: city,
    label: city,
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
      <style>{`
        .input-focus {
          transition: all 0.3s ease;
        }
        .input-focus:focus {
          box-shadow: 0 0 0 3px rgba(220, 20, 60, 0.1);
        }
      `}</style>

      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <img
              src="/icon.webp"
              alt="Gunaso"
              className="w-16 h-16 mx-auto mb-4 rounded-2xl shadow-lg"
            />
          </Link>
          <h1
            className="text-4xl font-bold mb-2 font-nepali"
            style={{ color: APP_CONFIG.colors.primary }}
          >
            {APP_CONFIG.name.nepali}
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Create Account
          </h2>
          <p className="text-gray-600">Join {APP_CONFIG.name.english} today</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Form Error */}
          {errors.form && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle
                size={20}
                className="text-red-600 mr-3 flex-shrink-0 mt-0.5"
              />
              <p className="text-red-600 text-sm">{errors.form}</p>
            </div>
          )}

          <div className="space-y-5">
            {/* User Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, type: "citizen", city: "" })
                  }
                  disabled={loading}
                  className={`p-3 rounded-lg border-2 font-medium transition ${
                    formData.type === "citizen"
                      ? "border-current text-white"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                  style={
                    formData.type === "citizen"
                      ? {
                          backgroundColor: APP_CONFIG.colors.primary,
                          borderColor: APP_CONFIG.colors.primary,
                        }
                      : {}
                  }
                >
                  Citizen
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, type: "authority" })
                  }
                  disabled={loading}
                  className={`p-3 rounded-lg border-2 font-medium transition ${
                    formData.type === "authority"
                      ? "border-current text-white"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                  style={
                    formData.type === "authority"
                      ? {
                          backgroundColor: APP_CONFIG.colors.secondary,
                          borderColor: APP_CONFIG.colors.secondary,
                        }
                      : {}
                  }
                >
                  Authority
                </button>
              </div>
            </div>
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyPress}
                  disabled={loading}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none input-focus disabled:opacity-50 ${
                    errors.name && touched.name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>
              {errors.name && touched.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.name}
                </p>
              )}
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none input-focus disabled:opacity-50 ${
                    errors.email && touched.email
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="your@email.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && touched.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.email}
                </p>
              )}
            </div>
            {/* City (for authorities only) */}
            {formData.type === "authority" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building
                    className="absolute left-4 top-4 text-gray-400 z-10"
                    size={20}
                  />
                  <Select
                    options={cityOptions}
                    value={cityOptions.find(
                      (option) => option.value === formData.city,
                    )}
                    onChange={(option) => {
                      setFormData({ ...formData, city: option?.value || "" });
                      if (touched.city) {
                        const error = validateField(
                          "city",
                          option?.value || "",
                        );
                        setErrors({ ...errors, city: error });
                      }
                    }}
                    onBlur={() => {
                      setTouched({ ...touched, city: true });
                      const error = validateField("city", formData.city);
                      setErrors({ ...errors, city: error });
                    }}
                    isDisabled={loading}
                    styles={customSelectStyles}
                    placeholder="Select your city"
                    isSearchable
                    isClearable
                    className={
                      errors.city && touched.city ? "border-red-500" : ""
                    }
                  />
                </div>
                {errors.city && touched.city && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.city}
                  </p>
                )}
              </div>
            )}{" "}
            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyPress}
                  disabled={loading}
                  className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:outline-none input-focus disabled:opacity-50 ${
                    errors.password && touched.password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.password}
                </p>
              )}
            </div>
            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyPress}
                  disabled={loading}
                  className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:outline-none input-focus disabled:opacity-50 ${
                    errors.confirmPassword && touched.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            {/* Submit Button */}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full text-white font-semibold py-3 rounded-lg transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-6"
              style={{ backgroundColor: APP_CONFIG.colors.primary }}
              onMouseEnter={(e) =>
                !loading &&
                (e.target.style.backgroundColor = APP_CONFIG.colors.primaryDark)
              }
              onMouseLeave={(e) =>
                !loading &&
                (e.target.style.backgroundColor = APP_CONFIG.colors.primary)
              }
            >
              {loading ? (
                <>
                  <Loader className="animate-spin mr-2" size={20} />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold hover:underline"
                style={{ color: APP_CONFIG.colors.primary }}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-600 hover:text-gray-800 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
