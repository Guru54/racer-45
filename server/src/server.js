require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('../config/database');
const { errorHandler } = require('./middleware/errorHandler');
const socketHandler = require('./socket/raceHandler');

const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const raceRoutes = require('./routes/raceRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

connectDB();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Typing Racer API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/races', raceRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

app.use(errorHandler);

socketHandler(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
