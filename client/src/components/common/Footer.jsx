import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700/50 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⚡</span>
              <span className="text-2xl font-black bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                TypeRacer
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
              The ultimate typing playground for developers and speed enthusiasts. 
              Train hard, type fast, dominate the leaderboards! 🚀
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/test/normal" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                  ⌨️ Practice Mode
                </Link>
              </li>
              <li>
                <Link to="/test/code" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
                  💻 Code Mode
                </Link>
              </li>
              <li>
                <Link to="/race" className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-200">
                  🏁 Multiplayer Race
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-200">
                  🏆 Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-bold mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <span>📧</span> Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <span>🐙</span> GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <span>🐦</span> Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-300 dark:border-gray-700/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">
            © 2026 <span className="bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent font-semibold">TypeRacer</span>. 
            Made with ❤️ for developers who type fast.
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
              Privacy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
              Terms
            </a>
            <div className="text-gray-400 dark:text-gray-600">
              v1.0.0
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
