const express = require('express');
const router = express.Router();
const { createRace, joinRace, getRace, getRaceHistory } = require('../controllers/raceController');
const { protect } = require('../middleware/auth');
const { apiLimiter, createLimiter } = require('../middleware/rateLimiter');

router.post('/', createLimiter, protect, createRace);
router.post('/join', apiLimiter, protect, joinRace);
router.get('/history', apiLimiter, protect, getRaceHistory);
router.get('/:roomCode', apiLimiter, protect, getRace);

module.exports = router;
