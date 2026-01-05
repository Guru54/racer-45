const TypingTest = require('../models/TypingTest');
const User = require('../models/User');

// @desc    Create new typing test result
// @route   POST /api/tests
// @access  Private
const createTest = async (req, res) => {
  try {
    const { mode, language, wpm, accuracy, errors, duration, textContent } = req.body;

    const test = await TypingTest.create({
      userId: req.user._id,
      mode,
      language,
      wpm,
      accuracy,
      errors,
      duration,
      textContent
    });

    // Update user stats
    const user = await User.findById(req.user._id);
    const statKey = mode === 'normal' ? 'normalTyping' : 'codeTyping';
    
    const currentTests = user.stats[statKey].testsCompleted;
    const currentAvgWpm = user.stats[statKey].avgWpm;
    const currentAvgAccuracy = user.stats[statKey].avgAccuracy;
    
    user.stats[statKey].testsCompleted = currentTests + 1;
    user.stats[statKey].avgWpm = ((currentAvgWpm * currentTests) + wpm) / (currentTests + 1);
    user.stats[statKey].avgAccuracy = ((currentAvgAccuracy * currentTests) + accuracy) / (currentTests + 1);
    
    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastPractice = user.stats.lastPracticeDate ? new Date(user.stats.lastPracticeDate) : null;
    
    if (lastPractice) {
      lastPractice.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - lastPractice) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        user.stats.currentStreak += 1;
      } else if (daysDiff > 1) {
        user.stats.currentStreak = 1;
      }
    } else {
      user.stats.currentStreak = 1;
    }
    
    if (user.stats.currentStreak > user.stats.longestStreak) {
      user.stats.longestStreak = user.stats.currentStreak;
    }
    
    user.stats.lastPracticeDate = new Date();
    await user.save();

    res.status(201).json(test);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user's typing tests
// @route   GET /api/tests
// @access  Private
const getTests = async (req, res) => {
  try {
    const { mode, limit = 10 } = req.query;
    
    const query = { userId: req.user._id };
    if (mode) {
      query.mode = mode;
    }

    const tests = await TypingTest.find(query)
      .sort({ completedAt: -1 })
      .limit(parseInt(limit));

    res.json(tests);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user statistics
// @route   GET /api/tests/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const tests = await TypingTest.find({ userId: req.user._id });
    
    const stats = {
      totalTests: tests.length,
      normalTests: tests.filter(t => t.mode === 'normal').length,
      codeTests: tests.filter(t => t.mode === 'code').length,
      avgWpm: tests.reduce((acc, t) => acc + t.wpm, 0) / (tests.length || 1),
      avgAccuracy: tests.reduce((acc, t) => acc + t.accuracy, 0) / (tests.length || 1)
    };

    res.json(stats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createTest,
  getTests,
  getStats
};
