const express = require('express');
const router = express.Router();
const { createRace, joinRace, getRace, getRaceHistory } = require('../controllers/raceController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createRace);
router.post('/join', protect, joinRace);
router.get('/history', protect, getRaceHistory);
router.get('/:roomCode', protect, getRace);

module.exports = router;
