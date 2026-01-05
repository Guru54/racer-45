import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="card mb-8">
          <div className="flex items-center space-x-6">
            <img
              src={user?.avatar || 'https://ui-avatars.com/api/?background=random'}
              alt={user?.username}
              className="w-24 h-24 rounded-full"
            />
            <div>
              <h1 className="text-3xl font-bold">{user?.username}</h1>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              <div className="mt-2">
                {user?.isPremium && (
                  <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-semibold">
                    ⭐ Premium
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Statistics</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Current Streak:</span>
                <span className="font-bold">{user?.stats?.currentStreak || 0} days 🔥</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Longest Streak:</span>
                <span className="font-bold">{user?.stats?.longestStreak || 0} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Tests:</span>
                <span className="font-bold">
                  {(user?.stats?.normalTyping?.testsCompleted || 0) + (user?.stats?.codeTyping?.testsCompleted || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Member Since:</span>
                <span className="font-bold">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Normal Typing</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Average WPM:</span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  {Math.round(user?.stats?.normalTyping?.avgWpm || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Average Accuracy:</span>
                <span className="font-bold">
                  {Math.round(user?.stats?.normalTyping?.avgAccuracy || 0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tests Completed:</span>
                <span className="font-bold">{user?.stats?.normalTyping?.testsCompleted || 0}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Code Typing</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Average WPM:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {Math.round(user?.stats?.codeTyping?.avgWpm || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Average Accuracy:</span>
                <span className="font-bold">
                  {Math.round(user?.stats?.codeTyping?.avgAccuracy || 0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tests Completed:</span>
                <span className="font-bold">{user?.stats?.codeTyping?.testsCompleted || 0}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Racing Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Races Won:</span>
                <span className="font-bold text-yellow-600 dark:text-yellow-400">
                  {user?.stats?.racesWon || 0} 🏆
                </span>
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
      </div>
    </div>
  );
};

export default Profile;
