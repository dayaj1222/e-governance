import { Link } from "react-router-dom";
import APP_CONFIG from "../../config/app.config";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto border-t-4 border-primary">
      <div className="container mx-auto px-4 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <img
                src="/icon.webp"
                alt="Gunaso"
                className="w-10 h-10 rounded-lg"
              />
              <div>
                <h3 className="text-lg font-bold font-nepali">
                  {APP_CONFIG.name.nepali}
                </h3>
                <p className="text-xs text-gray-400">{APP_CONFIG.tagline}</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering citizens and authorities to work together for a better
              community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-400 hover:text-primary transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-sm text-gray-400 hover:text-primary transition"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-sm text-gray-400 hover:text-primary transition"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-gray-400 hover:text-primary transition"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-400">
                <Mail size={16} className="mr-2 flex-shrink-0" />
                <a
                  href={`mailto:${APP_CONFIG.contact.email}`}
                  className="hover:text-primary transition"
                >
                  {APP_CONFIG.contact.email}
                </a>
              </li>
              <li className="flex items-center text-sm text-gray-400">
                <Phone size={16} className="mr-2 flex-shrink-0" />
                <a
                  href={`tel:${APP_CONFIG.contact.phone}`}
                  className="hover:text-primary transition"
                >
                  {APP_CONFIG.contact.phone}
                </a>
              </li>
              <li className="flex items-center text-sm text-gray-400">
                <MapPin size={16} className="mr-2 flex-shrink-0" />
                <span>Nepal</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-500 text-center md:text-left">
              © {new Date().getFullYear()} {APP_CONFIG.name.english}. All rights
              reserved. | Version {APP_CONFIG.version}
            </p>
            <p className="text-xs text-gray-500 text-center md:text-right">
              Made with ❤️ for Nepal
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
