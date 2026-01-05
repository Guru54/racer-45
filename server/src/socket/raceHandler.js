const Race = require('../models/Race');
const User = require('../models/User');
const { getRandomBotName, getRandomBotDifficulty } = require('../utils/botNames');
const { simulateBotTyping } = require('../utils/botSimulator');
const { generateNormalText } = require('../utils/textGenerator');
const mongoose = require('mongoose');

// Matchmaking queue
const matchmakingQueue = [];
const botIntervals = {}; // Track bot intervals for cleanup

const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Try to create a match with available players
const tryCreateMatch = async (io, mode) => {
  const sameModeQueue = matchmakingQueue.filter(entry => entry.mode === mode);
  
  if (sameModeQueue.length >= 2) {
    // Take 2-5 players from queue
    const playersCount = Math.min(sameModeQueue.length, 5);
    const players = sameModeQueue.slice(0, playersCount);
    
    // Remove players from queue
    players.forEach(player => {
      const index = matchmakingQueue.findIndex(e => e.socketId === player.socketId);
      if (index !== -1) {
        matchmakingQueue.splice(index, 1);
      }
    });
    
    await createRaceWithPlayers(io, players, mode);
  }
};

// Create race with real players
const createRaceWithPlayers = async (io, players, mode) => {
  try {
    const roomCode = generateRoomCode();
    const text = generateNormalText(50);
    
    const race = new Race({
      roomCode,
      hostId: players[0].userId,
      mode,
      language: 'english',
      textContent: text,
      status: 'countdown',
      participants: players.map(p => ({
        userId: p.userId,
        username: p.username,
        isBot: false,
        wpm: 0,
        accuracy: 0,
        progress: 0
      }))
    });
    
    await race.save();
    
    // Add all players to room
    players.forEach(player => {
      const socket = io.sockets.sockets.get(player.socketId);
      if (socket) {
        socket.join(roomCode);
        socket.roomCode = roomCode;
        
        // Clear matchmaking timeout
        if (socket.matchmakingTimeout) {
          clearTimeout(socket.matchmakingTimeout);
        }
      }
    });
    
    // Notify all players
    io.to(roomCode).emit('race-found', {
      race,
      message: `Found ${players.length} players! Starting in 5...`
    });
    
    // Start countdown
    startCountdown(io, roomCode, race);
    
    console.log(`Race ${roomCode} created with ${players.length} real players`);
  } catch (error) {
    console.error('Error creating race with players:', error);
  }
};

// Create race with bots
const createRaceWithBots = async (io, queueEntry, mode) => {
  try {
    // Check if user is still in queue
    const stillInQueue = matchmakingQueue.find(
      entry => entry.socketId === queueEntry.socketId
    );
    
    if (!stillInQueue) {
      return; // User already in a race or cancelled
    }
    
    // Remove user from queue
    const index = matchmakingQueue.findIndex(
      entry => entry.socketId === queueEntry.socketId
    );
    if (index !== -1) {
      matchmakingQueue.splice(index, 1);
    }
    
    const roomCode = generateRoomCode();
    const text = generateNormalText(50);
    const botCount = Math.floor(Math.random() * 3) + 1; // 1-3 bots
    
    // Create bot participants
    const botParticipants = [];
    for (let i = 0; i < botCount; i++) {
      const botId = new mongoose.Types.ObjectId();
      botParticipants.push({
        userId: botId,
        username: getRandomBotName(),
        isBot: true,
        botDifficulty: getRandomBotDifficulty(),
        wpm: 0,
        accuracy: 0,
        progress: 0
      });
    }
    
    const race = new Race({
      roomCode,
      hostId: queueEntry.userId,
      mode,
      language: 'english',
      textContent: text,
      status: 'countdown',
      participants: [
        {
          userId: queueEntry.userId,
          username: queueEntry.username,
          isBot: false,
          wpm: 0,
          accuracy: 0,
          progress: 0
        },
        ...botParticipants
      ]
    });
    
    await race.save();
    
    // Add user to room
    const socket = io.sockets.sockets.get(queueEntry.socketId);
    if (socket) {
      socket.join(roomCode);
      socket.roomCode = roomCode;
      
      socket.emit('race-found', {
        race,
        message: `No players online. Racing against ${botCount} bot${botCount > 1 ? 's' : ''}!`
      });
      
      // Start countdown
      startCountdown(io, roomCode, race);
      
      console.log(`Race ${roomCode} created with bots for user ${queueEntry.username}`);
    }
  } catch (error) {
    console.error('Error creating race with bots:', error);
  }
};

// Countdown before race starts
const startCountdown = async (io, roomCode, race) => {
  let countdown = 5;
  
  const countdownInterval = setInterval(async () => {
    io.to(roomCode).emit('race-countdown', { countdown });
    
    countdown--;
    
    if (countdown < 0) {
      clearInterval(countdownInterval);
      
      // Start race
      race.status = 'started';
      race.startedAt = new Date();
      await race.save();
      
      io.to(roomCode).emit('race-started', { race });
      
      // Start bot simulations
      const words = race.textContent.trim().split(/\s+/);
      const totalWords = words.length;
      
      race.participants.forEach(participant => {
        if (participant.isBot) {
          const botSimulation = simulateBotTyping(
            participant,
            totalWords,
            io,
            roomCode,
            race
          );
          botIntervals[`${roomCode}_${participant.userId}`] = botSimulation;
        }
      });
      
      console.log(`Race ${roomCode} started`);
    }
  }, 1000);
};

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Find race - Auto matchmaking
    socket.on('find-race', async ({ userId, username, mode = 'normal' }) => {
      try {
        console.log(`User ${username} (${userId}) looking for race`);

        // Add user to matchmaking queue
        const queueEntry = {
          socketId: socket.id,
          userId,
          username,
          mode,
          timestamp: Date.now()
        };

        matchmakingQueue.push(queueEntry);
        socket.matchmakingEntry = queueEntry;

        // Notify user they're in queue
        socket.emit('matchmaking-status', { 
          status: 'searching',
          message: 'Finding opponents...'
        });

        // Try to create a match immediately
        setTimeout(() => tryCreateMatch(io, mode), 1000);

        // Set timeout for adding bots if no match found
        socket.matchmakingTimeout = setTimeout(async () => {
          await createRaceWithBots(io, queueEntry, mode);
        }, 10000); // 10 seconds

      } catch (error) {
        console.error('Error in find-race:', error);
        socket.emit('race-error', { message: error.message });
      }
    });

    // Cancel matchmaking
    socket.on('cancel-matchmaking', () => {
      if (socket.matchmakingTimeout) {
        clearTimeout(socket.matchmakingTimeout);
      }
      
      const index = matchmakingQueue.findIndex(
        entry => entry.socketId === socket.id
      );
      
      if (index !== -1) {
        matchmakingQueue.splice(index, 1);
        console.log(`User ${socket.id} cancelled matchmaking`);
      }
      
      socket.emit('matchmaking-status', {
        status: 'cancelled',
        message: 'Matchmaking cancelled'
      });
    });

    // Join race room
    socket.on('join-race', async ({ roomCode, userId }) => {
      try {
        const race = await Race.findOne({ roomCode: roomCode.toUpperCase() });
        
        if (!race) {
          socket.emit('race-error', { message: 'Race room not found' });
          return;
        }

        socket.join(roomCode);
        socket.roomCode = roomCode;
        socket.userId = userId;
        
        io.to(roomCode).emit('participant-joined', {
          participants: race.participants,
          race
        });

        console.log(`User ${userId} joined race room ${roomCode}`);
      } catch (error) {
        socket.emit('race-error', { message: error.message });
      }
    });

    // Start race
    socket.on('start-race', async ({ roomCode }) => {
      try {
        const race = await Race.findOne({ roomCode: roomCode.toUpperCase() });
        
        if (!race) {
          socket.emit('race-error', { message: 'Race room not found' });
          return;
        }

        if (race.hostId.toString() !== socket.userId.toString()) {
          socket.emit('race-error', { message: 'Only host can start the race' });
          return;
        }

        race.status = 'started';
        race.startedAt = new Date();
        await race.save();

        io.to(roomCode).emit('race-started', { race });
        console.log(`Race ${roomCode} started`);
      } catch (error) {
        socket.emit('race-error', { message: error.message });
      }
    });

    // Update progress
    socket.on('update-progress', async ({ roomCode, userId, progress, wpm, accuracy }) => {
      try {
        const race = await Race.findOne({ roomCode: roomCode.toUpperCase() });
        
        if (!race) {
          return;
        }

        const participant = race.participants.find(
          p => p.userId.toString() === userId
        );

        if (participant) {
          participant.progress = progress;
          participant.wpm = wpm;
          participant.accuracy = accuracy;

          if (progress >= 100 && !participant.finishedAt) {
            participant.finishedAt = new Date();
          }

          await race.save();

          io.to(roomCode).emit('progress-updated', {
            userId,
            progress,
            wpm,
            accuracy,
            participants: race.participants
          });
        }
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    });

    // Finish race
    socket.on('finish-race', async ({ roomCode, userId }) => {
      try {
        const race = await Race.findOne({ roomCode: roomCode.toUpperCase() });
        
        if (!race) {
          return;
        }

        const participant = race.participants.find(
          p => p.userId.toString() === userId
        );

        if (participant && !participant.finishedAt) {
          participant.finishedAt = new Date();
          await race.save();
        }

        const allFinished = race.participants.every(p => p.finishedAt);

        if (allFinished) {
          race.status = 'finished';
          race.endedAt = new Date();

          race.participants.sort((a, b) => {
            return new Date(a.finishedAt) - new Date(b.finishedAt);
          });

          race.participants.forEach((p, index) => {
            p.position = index + 1;
          });

          await race.save();

          // Update stats only for real users (not bots)
          const winner = race.participants[0];
          if (!winner.isBot) {
            const user = await User.findById(winner.userId);
            if (user) {
              user.stats.racesWon += 1;
              user.stats.totalRaces += 1;
              await user.save();
            }
          }

          for (let i = 1; i < race.participants.length; i++) {
            if (!race.participants[i].isBot) {
              const loserUser = await User.findById(race.participants[i].userId);
              if (loserUser) {
                loserUser.stats.totalRaces += 1;
                await loserUser.save();
              }
            }
          }

          // Clean up bot intervals
          Object.keys(botIntervals).forEach(key => {
            if (key.startsWith(roomCode)) {
              if (botIntervals[key].stop) {
                botIntervals[key].stop();
              }
              delete botIntervals[key];
            }
          });

          io.to(roomCode).emit('race-finished', { race });
        }
      } catch (error) {
        console.error('Error finishing race:', error);
      }
    });

    // Leave race
    socket.on('leave-race', ({ roomCode }) => {
      socket.leave(roomCode);
      console.log(`User left race room ${roomCode}`);
    });

    // Handle bot finishing (called from botSimulator)
    socket.on('bot-finished-internal', async ({ roomCode, botUserId }) => {
      try {
        const race = await Race.findOne({ roomCode: roomCode.toUpperCase() });
        
        if (!race) {
          return;
        }

        const participant = race.participants.find(
          p => p.userId.toString() === botUserId.toString()
        );

        if (participant && !participant.finishedAt) {
          participant.finishedAt = new Date();
          participant.progress = 100;
          await race.save();
          
          // Check if all finished
          const allFinished = race.participants.every(p => p.finishedAt);
          if (allFinished) {
            // Trigger race finish
            socket.emit('finish-race', { roomCode, userId: botUserId });
          }
        }
      } catch (error) {
        console.error('Error handling bot finish:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      // Clear matchmaking timeout
      if (socket.matchmakingTimeout) {
        clearTimeout(socket.matchmakingTimeout);
      }
      
      // Remove from matchmaking queue
      const index = matchmakingQueue.findIndex(
        entry => entry.socketId === socket.id
      );
      if (index !== -1) {
        matchmakingQueue.splice(index, 1);
      }
      
      // Clean up bot intervals if user was host
      if (socket.roomCode) {
        const roomCode = socket.roomCode;
        Object.keys(botIntervals).forEach(key => {
          if (key.startsWith(roomCode)) {
            if (botIntervals[key].stop) {
              botIntervals[key].stop();
            }
            delete botIntervals[key];
          }
        });
      }
    });
  });
};

module.exports = socketHandler;
