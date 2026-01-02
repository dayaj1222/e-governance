import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import APP_CONFIG from "../../config/app.config";
import {
  Menu,
  X,
  Home,
  FileText,
  User,
  LogOut,
  Bell,
  Info,
} from "lucide-react";

const Header = () => {
  const { user, logout, isCitizen, isAuthority } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = isCitizen()
    ? [
        { path: "/citizen/dashboard", label: "Dashboard", icon: Home },
        {
          path: "/citizen/create-complaint",
          label: "Report Issue",
          icon: FileText,
        },
        { path: "/about", label: "About", icon: Info }, // Added here
      ]
    : [
        { path: "/authority/dashboard", label: "Dashboard", icon: Home },
        { path: "/about", label: "About", icon: Info }, // Added here
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-md sticky top-0 z-10000">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to={isCitizen() ? "/citizen/dashboard" : "/authority/dashboard"}
            className="flex items-center space-x-3 flex-shrink-0"
          >
            <img
              src="/icon.webp"
              alt="Gunaso"
              className="w-10 h-10 rounded-lg"
            />
            <div className="hidden sm:block">
              <h1
                className="text-xl font-bold font-nepali"
                style={{ color: APP_CONFIG.colors.primary }}
              >
                {APP_CONFIG.name.nepali}
              </h1>
              <p className="text-xs text-gray-600 leading-none">
                {APP_CONFIG.tagline}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition ${
                    isActive(link.path)
                      ? "text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  style={
                    isActive(link.path)
                      ? { backgroundColor: APP_CONFIG.colors.primary }
                      : {}
                  }
                >
                  <Icon size={18} className="mr-2" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* User Info */}
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-600 capitalize">
                  {user?.type}
                  {user?.city && ` • ${user.city}`}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 rounded-lg transition font-semibold text-sm text-white"
                style={{ backgroundColor: APP_CONFIG.colors.primary }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor =
                    APP_CONFIG.colors.primaryDark)
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = APP_CONFIG.colors.primary)
                }
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {/* Navigation Links */}
            <nav className="space-y-1 mb-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-lg font-medium transition ${
                      isActive(link.path)
                        ? "text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    style={
                      isActive(link.path)
                        ? { backgroundColor: APP_CONFIG.colors.primary }
                        : {}
                    }
                  >
                    <Icon size={18} className="mr-3" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* User Info */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between px-4 py-2 mb-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-600 capitalize">
                    {user?.type}
                    {user?.city && ` • ${user.city}`}
                  </p>
                </div>
                <button className="relative p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-3 rounded-lg transition font-semibold text-white"
                style={{ backgroundColor: APP_CONFIG.colors.primary }}
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
