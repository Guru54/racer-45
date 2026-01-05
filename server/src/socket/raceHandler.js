const Race = require('../models/Race');
const User = require('../models/User');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

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

          const winner = race.participants[0];
          const user = await User.findById(winner.userId);
          user.stats.racesWon += 1;
          user.stats.totalRaces += 1;
          await user.save();

          for (let i = 1; i < race.participants.length; i++) {
            const loserUser = await User.findById(race.participants[i].userId);
            loserUser.stats.totalRaces += 1;
            await loserUser.save();
          }

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

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = socketHandler;
