import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [scrolled, setScrolled] = useState(false);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="h-16 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-xl group-hover:rotate-12 transition-transform">⚡</span>
            <span className="text-xl font-black bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
              TypeRacer
            </span>
          </Link>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            {/* SIMPLE LINKS */}
            <Link
              to="/leaderboard"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white transition"
            >
              Leaderboard
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/test/normal"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white transition"
                >
                  Practice
                </Link>
              </>
            )}

            {/* MAIN CTA */}
            <Link
              to={isAuthenticated ? "/race" : "/register"}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 text-white text-sm font-semibold hover:scale-105 transition-transform shadow-lg shadow-primary-500/20"
            >
              {isAuthenticated ? "🏁 Race Now" : "Start Free"}
            </Link>

            {/* USER DROPDOWN */}
            {isAuthenticated && (
              <div className="relative group">
                <button
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 text-white font-bold text-sm flex items-center justify-center hover:scale-105 transition ring-2 ring-transparent hover:ring-primary-400/50"
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </button>
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.username}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Click below to logout</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    👤 Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}

            {/* THEME TOGGLE */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-white transition hover:scale-110"
            >
              {isDark ? "☀️" : "🌙"}
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
