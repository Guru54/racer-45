import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
import { generateNormalText } from '../utils/textGenerator';

const RacePage = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState('create');
  const [roomCode, setRoomCode] = useState('');
  const [race, setRace] = useState(null);
  const [socket, setSocket] = useState(null);
  const [input, setInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('participant-joined', ({ race }) => {
      setRace(race);
    });

    newSocket.on('race-started', ({ race }) => {
      setRace(race);
      setStartTime(Date.now());
      if (inputRef.current) {
        inputRef.current.focus();
      }
    });

    newSocket.on('progress-updated', ({ participants }) => {
      setRace((prevRace) => ({
        ...prevRace,
        participants
      }));
    });

    newSocket.on('race-finished', ({ race }) => {
      setRace(race);
      toast.success('Race finished!');
    });

    newSocket.on('race-error', ({ message }) => {
      toast.error(message);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const createRace = async () => {
    try {
      const text = generateNormalText(50);
      const response = await axios.post(`${API_URL}/api/races`, {
        mode: 'normal',
        language: 'english',
        textContent: text
      });
      
      setRace(response.data);
      socket.emit('join-race', {
        roomCode: response.data.roomCode,
        userId: user._id
      });
      
      toast.success(`Race created! Room code: ${response.data.roomCode}`);
    } catch (error) {
      toast.error('Failed to create race');
    }
  };

  const joinRace = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/races/join`, {
        roomCode: roomCode.toUpperCase()
      });
      
      setRace(response.data);
      socket.emit('join-race', {
        roomCode: response.data.roomCode,
        userId: user._id
      });
      
      toast.success('Joined race!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join race');
    }
  };

  const startRace = () => {
    if (race.hostId.toString() !== user._id.toString()) {
      toast.error('Only the host can start the race');
      return;
    }
    
    socket.emit('start-race', { roomCode: race.roomCode });
  };

  const handleInputChange = (e) => {
    if (race.status !== 'started') return;

    const value = e.target.value;
    setInput(value);
    setCurrentIndex(value.length);

    let errorCount = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== race.textContent[i]) {
        errorCount++;
      }
    }

    const acc = value.length > 0 ? Math.round(((value.length - errorCount) / value.length) * 100) : 100;
    setAccuracy(acc);

    const elapsed = (Date.now() - startTime) / 1000 / 60;
    const wordsTyped = value.trim().split(/\s+/).length;
    const currentWpm = Math.round(wordsTyped / elapsed) || 0;
    setWpm(currentWpm);

    const progress = Math.round((value.length / race.textContent.length) * 100);
    
    socket.emit('update-progress', {
      roomCode: race.roomCode,
      userId: user._id,
      progress,
      wpm: currentWpm,
      accuracy: acc
    });

    if (value === race.textContent) {
      socket.emit('finish-race', {
        roomCode: race.roomCode,
        userId: user._id
      });
    }
  };

  const renderText = () => {
    if (!race) return null;

    return race.textContent.split('').map((char, index) => {
      let className = 'char-pending';
      
      if (index < currentIndex) {
        className = input[index] === char ? 'char-correct' : 'char-incorrect';
      } else if (index === currentIndex) {
        className = 'char-current';
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  if (!race) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Multiplayer Race 🏁</h1>

        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setMode('create')}
              className={`px-6 py-3 rounded-lg ${
                mode === 'create' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              Create Race
            </button>
            <button
              onClick={() => setMode('join')}
              className={`px-6 py-3 rounded-lg ${
                mode === 'join' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              Join Race
            </button>
          </div>

          <div className="card">
            {mode === 'create' ? (
              <div className="text-center">
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  Create a new race room and share the code with your friends
                </p>
                <button onClick={createRace} className="btn-primary">
                  Create Race Room
                </button>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">Enter Room Code</label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="input-field mb-4"
                  placeholder="ABCDEF"
                  maxLength={6}
                />
                <button onClick={joinRace} className="btn-primary w-full">
                  Join Race
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Race Room: {race.roomCode}</h1>
          <div className="flex items-center space-x-4">
            <span className={`px-4 py-2 rounded-lg font-semibold ${
              race.status === 'waiting' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
              race.status === 'started' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
              'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
            }`}>
              {race.status === 'waiting' ? 'Waiting' : race.status === 'started' ? 'Racing' : 'Finished'}
            </span>
          </div>
        </div>

        <div className="card mb-6">
          <h3 className="text-xl font-bold mb-4">Participants ({race.participants.length})</h3>
          <div className="space-y-2">
            {race.participants.map((participant) => (
              <div
                key={participant.userId}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-semibold">{participant.username}</span>
                  {participant.userId.toString() === race.hostId.toString() && (
                    <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-xs rounded">
                      Host
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Progress: </span>
                    <span className="font-bold">{participant.progress}%</span>
                  </div>
                  {race.status === 'started' && (
                    <>
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">WPM: </span>
                        <span className="font-bold">{participant.wpm}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Acc: </span>
                        <span className="font-bold">{participant.accuracy}%</span>
                      </div>
                    </>
                  )}
                  {race.status === 'finished' && participant.position && (
                    <div className="text-lg font-bold">
                      {participant.position === 1 ? '🥇' : 
                       participant.position === 2 ? '🥈' : 
                       participant.position === 3 ? '🥉' : 
                       `#${participant.position}`}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {race.status === 'waiting' && race.hostId.toString() === user._id.toString() && (
          <div className="text-center mb-6">
            <button onClick={startRace} className="btn-primary text-lg px-8 py-3">
              Start Race
            </button>
          </div>
        )}

        {race.status === 'started' && (
          <div className="card mb-6">
            <div className="flex justify-around mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {wpm}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">WPM</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {accuracy}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
              </div>
            </div>

            <div className="text-2xl leading-relaxed font-mono mb-4 select-none">
              {renderText()}
            </div>

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              className="input-field font-mono text-lg"
              placeholder="Start typing..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </div>
        )}

        {race.status === 'finished' && (
          <div className="card text-center">
            <h2 className="text-3xl font-bold mb-6">Race Complete! 🏁</h2>
            <div className="text-xl mb-4">
              Winner: <span className="font-bold text-primary-600 dark:text-primary-400">
                {race.participants.find(p => p.position === 1)?.username}
              </span> 🏆
            </div>
            <button onClick={() => setRace(null)} className="btn-primary">
              Back to Lobby
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RacePage;
