import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import APP_CONFIG from "../config/app.config";

const Landing = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated()) {
    const path =
      user?.type === "citizen" ? "/citizen/dashboard" : "/authority/dashboard";
    return <Navigate to={path} replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg">
                <img src="/icon.webp" alt="app.icon" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary font-nepali">
                  {APP_CONFIG.name.nepali}
                </h1>
                <p className="text-xs text-gray-600">
                  {APP_CONFIG.name.english}
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="px-6 py-2 text-gray-700 hover:text-primary transition font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
                Civic Engagement Platform
              </div>
              <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Report Issues.
                <br />
                Track Progress.
                <br />
                <span className="text-primary">Build Better Cities.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                A platform connecting citizens with authorities to resolve civic
                issues efficiently. Report problems, track their status, and
                verify solutions.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold text-lg shadow-lg hover-lift"
                >
                  Start Reporting
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-primary hover:text-primary transition font-semibold text-lg"
                >
                  Sign In
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary rounded-2xl opacity-80"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary rounded-2xl opacity-80"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-primary mb-2">1000+</div>
              <div className="text-gray-600 font-medium">Issues Reported</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">850+</div>
              <div className="text-gray-600 font-medium">Issues Resolved</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600 font-medium">Active Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, efficient, and transparent process to report and resolve
              civic issues
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition hover-lift">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Report Issues
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Submit civic problems with photos, location, and detailed
                descriptions. Your reports help authorities prioritize work.
              </p>
            </div>

            <div className="p-8 bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition hover-lift">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Track Progress
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor complaint status in real-time. See when authorities
                acknowledge, start work, and complete resolutions.
              </p>
            </div>

            <div className="p-8 bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition hover-lift">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Verify Solutions
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Confirm when issues are resolved. Your verification helps ensure
                quality and accountability in civic services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Types */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Citizens */}
            <div className="bg-white p-10 rounded-2xl shadow-lg border-l-4 border-primary">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                For Citizens
              </h3>
              <p className="text-gray-600 mb-8">
                Be the voice of change in your community
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-primary mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Quick registration process
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-primary mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Report with photos and GPS location
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-primary mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Upvote existing complaints
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-primary mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Real-time status updates
                  </span>
                </li>
              </ul>
              <Link
                to="/register"
                className="block text-center bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition font-semibold"
              >
                Register as Citizen
              </Link>
            </div>

            {/* Authorities */}
            <div className="bg-white p-10 rounded-2xl shadow-lg border-l-4 border-secondary">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                For Authorities
              </h3>
              <p className="text-gray-600 mb-8">
                Manage and resolve civic issues efficiently
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-secondary mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">City-based registration</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-secondary mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Centralized complaint dashboard
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-secondary mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Status management workflow
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-secondary mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">Performance analytics</span>
                </li>
              </ul>
              <Link
                to="/register"
                className="block text-center bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary-dark transition font-semibold"
              >
                Register as Authority
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-nepal">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join the platform that's helping communities solve civic issues
            faster and more transparently.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-primary px-10 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition shadow-xl hover-scale"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 font-nepali">
                {APP_CONFIG.name.nepali}
              </h3>
              <p className="text-gray-400 mb-4">{APP_CONFIG.tagline}</p>
              <p className="text-sm text-gray-500">
                Version {APP_CONFIG.version}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/login"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400 text-sm mb-2">
                {APP_CONFIG.contact.email}
              </p>
              <p className="text-gray-400 text-sm">
                {APP_CONFIG.contact.phone}
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>
              © {new Date().getFullYear()} {APP_CONFIG.name.english}. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
