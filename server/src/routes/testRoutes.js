const express = require('express');
const router = express.Router();
const { createTest, getTests, getStats } = require('../controllers/testController');
const { protect } = require('../middleware/auth');
const { apiLimiter, createLimiter } = require('../middleware/rateLimiter');

router.post('/', createLimiter, protect, createTest);
router.get('/', apiLimiter, protect, getTests);
router.get('/stats', apiLimiter, protect, getStats);

module.exports = router;
