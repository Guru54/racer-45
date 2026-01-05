const Race = require('../models/Race');

// Generate random room code
const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// @desc    Create new race room
// @route   POST /api/races
// @access  Private
const createRace = async (req, res) => {
  try {
    const { mode, language, textContent } = req.body;

    if (!textContent) {
      return res.status(400).json({ message: 'Text content is required' });
    }

    let roomCode = generateRoomCode();
    let existingRoom = await Race.findOne({ roomCode });
    
    while (existingRoom) {
      roomCode = generateRoomCode();
      existingRoom = await Race.findOne({ roomCode });
    }

    const race = await Race.create({
      roomCode,
      hostId: req.user._id,
      mode: mode || 'normal',
      language: language || 'english',
      textContent,
      participants: [{
        userId: req.user._id,
        username: req.user.username
      }]
    });

    res.status(201).json(race);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Join race room
// @route   POST /api/races/join
// @access  Private
const joinRace = async (req, res) => {
  try {
    const { roomCode } = req.body;

    if (!roomCode) {
      return res.status(400).json({ message: 'Room code is required' });
    }

    const race = await Race.findOne({ roomCode: roomCode.toUpperCase() });

    if (!race) {
      return res.status(404).json({ message: 'Race room not found' });
    }

    if (race.status !== 'waiting') {
      return res.status(400).json({ message: 'Race has already started' });
    }

    const alreadyJoined = race.participants.some(
      p => p.userId.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
      return res.json(race);
    }

    race.participants.push({
      userId: req.user._id,
      username: req.user.username
    });

    await race.save();
    res.json(race);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get race by room code
// @route   GET /api/races/:roomCode
// @access  Private
const getRace = async (req, res) => {
  try {
    const race = await Race.findOne({ roomCode: req.params.roomCode.toUpperCase() });

    if (!race) {
      return res.status(404).json({ message: 'Race room not found' });
    }

    res.json(race);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user's race history
// @route   GET /api/races/history
// @access  Private
const getRaceHistory = async (req, res) => {
  try {
    const races = await Race.find({
      'participants.userId': req.user._id,
      status: 'finished'
    })
      .sort({ endedAt: -1 })
      .limit(20);

    res.json(races);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createRace,
  joinRace,
  getRace,
  getRaceHistory
};
