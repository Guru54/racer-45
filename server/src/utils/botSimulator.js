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
 * @param {Function} getRace - Function to get updated race from database
 * @returns {Object} - Interval ID for cleanup
 */
const simulateBotTyping = (bot, totalWords, io, roomCode, getRace) => {
  const speedConfig = BOT_SPEEDS[bot.botDifficulty] || BOT_SPEEDS.medium;
  const baseWpm = randomBetween(speedConfig.minWpm, speedConfig.maxWpm);
  const msPerWord = 60000 / baseWpm;
  
  let wordsTyped = 0;
  let stopped = false;
  
  const typeInterval = setInterval(async () => {
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
    
    // Update race in database
    const race = await getRace();
    if (race) {
      const participant = race.participants.find(
        p => p.userId.toString() === bot.userId.toString()
      );
      
      if (participant) {
        participant.progress = progress;
        participant.wpm = currentWpm;
        participant.accuracy = accuracy;
        
        if (wordsTyped >= totalWords && !participant.finishedAt) {
          participant.finishedAt = new Date();
        }
        
        await race.save();
        
        // Emit progress update
        io.to(roomCode).emit('progress-updated', {
          participants: race.participants
        });
      }
    }
    
    if (wordsTyped >= totalWords) {
      clearInterval(typeInterval);
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
