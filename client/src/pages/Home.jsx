import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Master Your Typing Speed
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Practice typing with words or code. Compete with others in real-time races!
        </p>
        {!isAuthenticated ? (
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-3">
              Login
            </Link>
          </div>
        ) : (
          <div className="flex justify-center space-x-4">
            <Link to="/test/normal" className="btn-primary text-lg px-8 py-3">
              Start Practicing
            </Link>
            <Link to="/race" className="btn-secondary text-lg px-8 py-3">
              Join a Race
            </Link>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="card text-center">
          <div className="text-4xl mb-4">⌨️</div>
          <h3 className="text-xl font-bold mb-2">Normal Typing</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Practice with common English words to improve your typing speed
          </p>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-4">💻</div>
          <h3 className="text-xl font-bold mb-2">Code Typing</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Type code snippets in multiple programming languages
          </p>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-4">🏁</div>
          <h3 className="text-xl font-bold mb-2">Multiplayer Races</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Compete with friends in real-time typing races
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-3xl font-bold mb-6 text-center">Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <span className="text-2xl mr-4">📊</span>
            <div>
              <h4 className="font-bold mb-1">Detailed Analytics</h4>
              <p className="text-gray-600 dark:text-gray-400">Track your WPM, accuracy, and progress over time</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-2xl mr-4">🏆</span>
            <div>
              <h4 className="font-bold mb-1">Leaderboards</h4>
              <p className="text-gray-600 dark:text-gray-400">Compete globally with daily, weekly, and all-time rankings</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-2xl mr-4">🔥</span>
            <div>
              <h4 className="font-bold mb-1">Streak System</h4>
              <p className="text-gray-600 dark:text-gray-400">Build daily practice streaks and stay motivated</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-2xl mr-4">🌙</span>
            <div>
              <h4 className="font-bold mb-1">Dark Mode</h4>
              <p className="text-gray-600 dark:text-gray-400">Easy on the eyes with full dark mode support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
