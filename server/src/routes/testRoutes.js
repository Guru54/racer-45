const express = require('express');
const router = express.Router();
const { createTest, getTests, getStats } = require('../controllers/testController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createTest);
router.get('/', protect, getTests);
router.get('/stats', protect, getStats);

module.exports = router;
