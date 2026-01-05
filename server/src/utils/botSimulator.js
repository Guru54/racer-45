const BOT_SPEEDS = {
  easy: { minWpm: 30, maxWpm: 45 },
  medium: { minWpm: 45, maxWpm: 60 },
  hard: { minWpm: 60, maxWpm: 80 }
};

const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Simulates a bot typing through the text
 * @param {Object} bot - Bot participant object
 * @param {Number} totalWords - Total number of words in the text
 * @param {Object} io - Socket.io instance
 * @param {String} roomCode - Race room code
 * @param {Object} race - Race object from database
 * @returns {Object} - Interval ID for cleanup
 */
const simulateBotTyping = (bot, totalWords, io, roomCode, race) => {
  const speedConfig = BOT_SPEEDS[bot.botDifficulty] || BOT_SPEEDS.medium;
  const baseWpm = randomBetween(speedConfig.minWpm, speedConfig.maxWpm);
  const msPerWord = 60000 / baseWpm;
  
  let wordsTyped = 0;
  let stopped = false;
  
  const typeInterval = setInterval(() => {
    if (stopped) {
      clearInterval(typeInterval);
      return;
    }

    wordsTyped++;
    const progress = Math.min(Math.round((wordsTyped / totalWords) * 100), 100);
    
    // Add slight randomness to feel natural
    const variance = randomBetween(-5, 5);
    const currentWpm = Math.max(baseWpm + variance, 1);
    
    // Calculate accuracy with slight variations (bots are generally accurate)
    const accuracy = randomBetween(90, 98);
    
    io.to(roomCode).emit('progress-updated', {
      userId: bot.userId,
      username: bot.username,
      progress,
      wpm: currentWpm,
      accuracy,
      isBot: true,
      participants: race.participants
    });
    
    if (wordsTyped >= totalWords) {
      clearInterval(typeInterval);
      // Bot finished
      io.to(roomCode).emit('bot-finished', {
        userId: bot.userId,
        username: bot.username
      });
    }
  }, msPerWord + randomBetween(-100, 200)); // Natural variance in typing speed
  
  return {
    stop: () => {
      stopped = true;
      clearInterval(typeInterval);
    },
    interval: typeInterval
  };
};

module.exports = {
  BOT_SPEEDS,
  simulateBotTyping,
  randomBetween
};
