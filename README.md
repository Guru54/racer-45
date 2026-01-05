# ⚡ TypeRacer - Typing Speed Test & Racing Application

A full-stack typing speed test and multiplayer racing application designed specifically for CSE students. Practice typing with normal words or code snippets in multiple programming languages, and compete with friends in real-time typing races!

## 🌟 Features

### Typing Modes
- **Normal Typing Mode**: Practice with common English words
  - Real-time WPM (Words Per Minute) calculation
  - Accuracy percentage tracking
  - Error count display
  - Multiple timer options (30s, 60s, 120s)

- **Code Typing Mode**: Type code snippets
  - Support for C, C++, Java, Python, JavaScript
  - Syntax-highlighted code snippets
  - Language-specific challenges

### Multiplayer Racing
- Create race rooms with unique room codes
- Join rooms via room code
- Real-time race progress for all participants
- Live leaderboard showing position, WPM, and progress
- Race results screen with final rankings

### Analytics & Dashboard
- Detailed statistics tracking (WPM history, accuracy trends)
- Progress graphs (weekly/monthly)
- Daily practice streak system
- Personal best records

### Leaderboard System
- Daily, weekly, and all-time leaderboards
- Separate leaderboards for normal and code typing modes
- Language-specific rankings

### User Features
- Email/Password authentication
- Google OAuth login support
- User profiles with avatars
- Achievement tracking
- Dark mode support

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (JavaScript)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.io
- **Authentication**: JWT + bcryptjs
- **Validation**: Express Validator

## 📁 Project Structure

```
├── client/                     # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TypingArena/    # Main typing component
│   │   │   ├── RaceRoom/       # Multiplayer race room
│   │   │   ├── Leaderboard/    # Leaderboard component
│   │   │   ├── Dashboard/      # User dashboard & analytics
│   │   │   └── common/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── context/            # React Context providers
│   │   ├── utils/              # Utility functions
│   │   └── styles/             # Global styles
│   └── package.json
│
├── server/                     # Node.js Backend
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   ├── models/             # Mongoose models
│   │   ├── routes/             # Express routes
│   │   ├── socket/             # Socket.io event handlers
│   │   ├── middleware/         # Auth & error handling
│   │   └── utils/              # Helper functions
│   ├── config/                 # Configuration files
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Guru54/racer-45.git
   cd racer-45
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**

   Create `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/typing-racer
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   JWT_EXPIRE=7d
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

   Create `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_SOCKET_URL=http://localhost:5000
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

7. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```

8. **Open your browser**
   - Navigate to `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

#### Register
- **POST** `/api/auth/register`
- Body: `{ email, username, password }`
- Returns: User object with JWT token

#### Login
- **POST** `/api/auth/login`
- Body: `{ email, password }`
- Returns: User object with JWT token

#### Get Current User
- **GET** `/api/auth/me`
- Headers: `Authorization: Bearer <token>`
- Returns: User object

### Typing Test Endpoints

#### Create Test Result
- **POST** `/api/tests`
- Headers: `Authorization: Bearer <token>`
- Body: `{ mode, language, wpm, accuracy, errors, duration, textContent }`
- Returns: Test object

#### Get User Tests
- **GET** `/api/tests?mode=normal&limit=10`
- Headers: `Authorization: Bearer <token>`
- Returns: Array of test objects

#### Get User Statistics
- **GET** `/api/tests/stats`
- Headers: `Authorization: Bearer <token>`
- Returns: Statistics object

### Race Endpoints

#### Create Race
- **POST** `/api/races`
- Headers: `Authorization: Bearer <token>`
- Body: `{ mode, language, textContent }`
- Returns: Race object with room code

#### Join Race
- **POST** `/api/races/join`
- Headers: `Authorization: Bearer <token>`
- Body: `{ roomCode }`
- Returns: Race object

#### Get Race
- **GET** `/api/races/:roomCode`
- Headers: `Authorization: Bearer <token>`
- Returns: Race object

#### Get Race History
- **GET** `/api/races/history`
- Headers: `Authorization: Bearer <token>`
- Returns: Array of race objects

### Leaderboard Endpoints

#### Get Leaderboard
- **GET** `/api/leaderboard?period=all&mode=normal&language=javascript`
- Returns: Array of leaderboard entries

## 🎮 Socket.io Events

### Client to Server Events
- `join-race`: Join a race room
- `start-race`: Start the race (host only)
- `update-progress`: Update typing progress
- `finish-race`: Finish the race
- `leave-race`: Leave the race room

### Server to Client Events
- `participant-joined`: New participant joined
- `race-started`: Race has started
- `progress-updated`: Participant progress updated
- `race-finished`: Race has finished
- `race-error`: Error occurred

## 🎨 Features in Detail

### Dark Mode
Toggle between light and dark themes with persistent storage. The application automatically remembers your preference.

### Streak System
Build daily practice streaks to stay motivated. The system tracks:
- Current streak
- Longest streak
- Last practice date

### Real-time Multiplayer
Using Socket.io for real-time communication:
- Live progress updates
- Instant WPM calculations
- Real-time leaderboard positions

### Analytics Dashboard
Visualize your progress with:
- Line charts showing WPM and accuracy trends
- Recent test history
- Comprehensive statistics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Authors

Built with ❤️ for CSE students

## 🙏 Acknowledgments

- Inspired by 10FastFingers and SpeedCoder
- Built as a learning project for full-stack development
- Special thanks to the open-source community

## 📧 Support

For support, please open an issue in the GitHub repository.

---

**Happy Typing! ⚡**
