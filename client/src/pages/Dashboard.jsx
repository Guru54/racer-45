import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tests?limit=20`);
      setTests(response.data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = tests.slice(0, 10).reverse().map((test, index) => ({
    name: `Test ${index + 1}`,
    wpm: test.wpm,
    accuracy: test.accuracy
  }));

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-400">
            Current Streak
          </h3>
          <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
            {user?.stats?.currentStreak || 0} 🔥
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Longest: {user?.stats?.longestStreak || 0} days
          </p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-400">
            Normal Typing
          </h3>
          <div className="text-4xl font-bold text-green-600 dark:text-green-400">
            {Math.round(user?.stats?.normalTyping?.avgWpm || 0)} WPM
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {user?.stats?.normalTyping?.testsCompleted || 0} tests completed
          </p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-400">
            Code Typing
          </h3>
          <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
            {Math.round(user?.stats?.codeTyping?.avgWpm || 0)} WPM
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {user?.stats?.codeTyping?.testsCompleted || 0} tests completed
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/test/normal" className="block btn-primary text-center">
              Normal Typing Test
            </Link>
            <Link to="/test/code" className="block btn-secondary text-center">
              Code Typing Test
            </Link>
            <Link to="/race" className="block btn-secondary text-center">
              Join/Create Race
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-bold mb-4">Race Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Races Won:</span>
              <span className="font-bold">{user?.stats?.racesWon || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Races:</span>
              <span className="font-bold">{user?.stats?.totalRaces || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Win Rate:</span>
              <span className="font-bold">
                {user?.stats?.totalRaces > 0
                  ? Math.round((user.stats.racesWon / user.stats.totalRaces) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="card mb-8">
          <h3 className="text-xl font-bold mb-4">Recent Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="wpm" stroke="#0ea5e9" strokeWidth={2} name="WPM" />
              <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} name="Accuracy %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card">
        <h3 className="text-xl font-bold mb-4">Recent Tests</h3>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : tests.length === 0 ? (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            No tests yet. Start practicing!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4">Mode</th>
                  <th className="text-center py-3 px-4">WPM</th>
                  <th className="text-center py-3 px-4">Accuracy</th>
                  <th className="text-center py-3 px-4">Errors</th>
                  <th className="text-right py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test) => (
                  <tr
                    key={test._id}
                    className="border-b border-gray-100 dark:border-gray-800"
                  >
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        test.mode === 'normal'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                      }`}>
                        {test.mode}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4 font-bold">{test.wpm}</td>
                    <td className="text-center py-3 px-4">{test.accuracy}%</td>
                    <td className="text-center py-3 px-4">{test.errors}</td>
                    <td className="text-right py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(test.completedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
