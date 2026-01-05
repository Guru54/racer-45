const mongoose = require('mongoose');

const typingTestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mode: {
    type: String,
    enum: ['normal', 'code'],
    required: true
  },
  language: {
    type: String,
    default: 'english'
  },
  wpm: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    required: true
  },
  errors: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    required: true
  },
  textContent: {
    type: String,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
typingTestSchema.index({ userId: 1, completedAt: -1 });
typingTestSchema.index({ mode: 1, completedAt: -1 });

module.exports = mongoose.model('TypingTest', typingTestSchema);
