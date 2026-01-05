import { useState, useEffect } from 'react';
import axios from 'axios';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [period, setPeriod] = useState('all');
  const [mode, setMode] = useState('normal');
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchLeaderboard();
  }, [period, mode]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/leaderboard`, {
        params: { period, mode }
      });
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Leaderboard 🏆</h1>

      <div className="flex justify-center space-x-4 mb-8">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="input-field w-40"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="all">All Time</option>
        </select>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="input-field w-40"
        >
          <option value="normal">Normal</option>
          <option value="code">Code</option>
        </select>
      </div>

      <div className="max-w-4xl mx-auto card">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            No data available
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4">Rank</th>
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-center py-3 px-4">Max WPM</th>
                  <th className="text-center py-3 px-4">Avg WPM</th>
                  <th className="text-center py-3 px-4">Accuracy</th>
                  <th className="text-center py-3 px-4">Tests</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr
                    key={entry.userId}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-4">
                      <span className={`font-bold ${
                        index === 0 ? 'text-yellow-500' :
                        index === 1 ? 'text-gray-400' :
                        index === 2 ? 'text-orange-600' :
                        ''
                      }`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <img
                          src={entry.avatar || 'https://ui-avatars.com/api/?background=random'}
                          alt={entry.username}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        {entry.username}
                      </div>
                    </td>
                    <td className="text-center py-3 px-4 font-bold text-primary-600 dark:text-primary-400">
                      {entry.maxWpm}
                    </td>
                    <td className="text-center py-3 px-4">
                      {entry.avgWpm}
                    </td>
                    <td className="text-center py-3 px-4">
                      {entry.avgAccuracy}%
                    </td>
                    <td className="text-center py-3 px-4">
                      {entry.testsCompleted}
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

export default LeaderboardPage;
