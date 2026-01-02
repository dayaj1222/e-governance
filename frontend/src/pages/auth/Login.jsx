import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import APP_CONFIG from "../../config/app.config";
import {
  Mail,
  Lock,
  AlertCircle,
  Loader,
  Eye,
  EyeOff,
  Users,
  ShieldCheck,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);

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
      case "email":
        if (!value) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Email is invalid";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
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
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    console.log("Login clicked");

    setTouched({ email: true, password: true });

    if (!validateForm()) {
      console.log("Validation failed:", errors);
      toast.error("Please fix the errors");
      return;
    }

    setLoading(true);
    console.log("Attempting login with:", { email: formData.email });

    try {
      const result = await login(formData.email, formData.password);
      console.log("Login result:", result);

      if (result.success) {
        toast.success("Login successful!");
        const path =
          result.user.type === "citizen"
            ? "/citizen/dashboard"
            : "/authority/dashboard";
        setTimeout(() => navigate(path), 500);
      } else {
        console.error("Login failed:", result.error);
        toast.error(result.error || "Login failed");
        setErrors({ form: result.error });
      }
    } catch (error) {
      console.error("Login exception:", error);
      toast.error("Something went wrong");
      setErrors({ form: "Network error. Please check your connection." });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleLogin();
    }
  };

  const fillDemoAccount = (type) => {
    if (type === "citizen") {
      setFormData({
        email: "test@example.com",
        password: "test123",
      });
    } else {
      setFormData({
        email: "test@gmail.com",
        password: "test123",
      });
    }
    setErrors({});
    setTouched({});
    toast.info(`Demo ${type} credentials filled!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to continue to {APP_CONFIG.name.english}
          </p>
        </div>

        {/* Demo Accounts - Prominent */}
        <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
          <p className="text-sm font-semibold text-blue-900 mb-3 text-center">
            🚀 Quick Demo Access
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => fillDemoAccount("citizen")}
              disabled={loading}
              className="flex items-center justify-center px-4 py-3 bg-white border-2 border-blue-300 rounded-lg hover:bg-blue-50 transition font-semibold text-sm text-blue-700 disabled:opacity-50"
            >
              <Users size={18} className="mr-2" />
              Citizen Demo
            </button>
            <button
              onClick={() => fillDemoAccount("authority")}
              disabled={loading}
              className="flex items-center justify-center px-4 py-3 bg-white border-2 border-blue-300 rounded-lg hover:bg-blue-50 transition font-semibold text-sm text-blue-700 disabled:opacity-50"
            >
              <ShieldCheck size={18} className="mr-2" />
              Authority Demo
            </button>
          </div>
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

          <div className="space-y-6">
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
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none input-focus disabled:opacity-50 disabled:cursor-not-allowed ${
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
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:outline-none input-focus disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.password && touched.password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                  autoComplete="current-password"
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

            {/* Submit Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full text-white font-semibold py-3 rounded-lg transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold hover:underline"
                style={{ color: APP_CONFIG.colors.primary }}
              >
                Register here
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

export default Login;
