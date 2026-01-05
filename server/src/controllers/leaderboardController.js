const TypingTest = require('../models/TypingTest');
const User = require('../models/User');

// @desc    Get leaderboard
// @route   GET /api/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const { period = 'all', mode = 'normal', language } = req.query;

    let dateFilter = {};
    const now = new Date();

    if (period === 'daily') {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      dateFilter = { completedAt: { $gte: startOfDay } };
    } else if (period === 'weekly') {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      startOfWeek.setHours(0, 0, 0, 0);
      dateFilter = { completedAt: { $gte: startOfWeek } };
    }

    const matchQuery = { mode, ...dateFilter };
    if (language && language !== 'all') {
      matchQuery.language = language;
    }

    const leaderboard = await TypingTest.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$userId',
          maxWpm: { $max: '$wpm' },
          avgWpm: { $avg: '$wpm' },
          avgAccuracy: { $avg: '$accuracy' },
          testsCompleted: { $sum: 1 }
        }
      },
      { $sort: { maxWpm: -1 } },
      { $limit: 100 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: '$_id',
          username: '$user.username',
          avatar: '$user.avatar',
          maxWpm: 1,
          avgWpm: { $round: ['$avgWpm', 2] },
          avgAccuracy: { $round: ['$avgAccuracy', 2] },
          testsCompleted: 1
        }
      }
    ]);

    res.json(leaderboard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getLeaderboard
};
