const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controllers/leaderboardController');
const { apiLimiter } = require('../middleware/rateLimiter');

router.get('/', apiLimiter, getLeaderboard);

module.exports = router;
