const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  isBot: {
    type: Boolean,
    default: false
  },
  botDifficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: null
  },
  wpm: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0
  },
  progress: {
    type: Number,
    default: 0
  },
  position: {
    type: Number,
    default: 0
  },
  finishedAt: Date
}, { _id: false });

const raceSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mode: {
    type: String,
    enum: ['normal', 'code'],
    default: 'normal'
  },
  language: {
    type: String,
    default: 'english'
  },
  participants: [participantSchema],
  status: {
    type: String,
    enum: ['waiting', 'countdown', 'started', 'finished'],
    default: 'waiting'
  },
  textContent: {
    type: String,
    required: true
  },
  startedAt: Date,
  endedAt: Date
}, {
  timestamps: true
});

// Index for quick room code lookup
raceSchema.index({ roomCode: 1 });
raceSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Race', raceSchema);
