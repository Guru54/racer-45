import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

const RacePage = () => {
  const { user } = useAuth();
  const [race, setRace] = useState(null);
  const [socket, setSocket] = useState(null);
  const [matchmakingStatus, setMatchmakingStatus] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [input, setInput] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordStatuses, setWordStatuses] = useState([]);
  const [words, setWords] = useState([]);
  const [correctWords, setCorrectWords] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef(null);

  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Matchmaking status updates
    newSocket.on('matchmaking-status', ({ status, message }) => {
      setMatchmakingStatus({ status, message });
      if (status === 'searching') {
        toast.success(message);
      }
    });

    // Race found
    newSocket.on('race-found', ({ race, message }) => {
      setRace(race);
      setMatchmakingStatus(null);
      toast.success(message);
      
      // Initialize words
      const wordArray = race.textContent.trim().split(/\s+/);
      setWords(wordArray);
      setWordStatuses(new Array(wordArray.length).fill('pending'));
    });

    // Countdown updates
    newSocket.on('race-countdown', ({ countdown }) => {
      setCountdown(countdown);
    });

    // Race started
    newSocket.on('race-started', ({ race }) => {
      setRace(race);
      setCountdown(null);
      setStartTime(Date.now());
      if (inputRef.current) {
        inputRef.current.focus();
      }
    });

    // Progress updated
    newSocket.on('progress-updated', ({ participants }) => {
      setRace((prevRace) => ({
        ...prevRace,
        participants
      }));
    });

    // Race finished
    newSocket.on('race-finished', ({ race }) => {
      setRace(race);
      toast.success('Race finished!');
    });

    newSocket.on('race-error', ({ message }) => {
      toast.error(message);
      setMatchmakingStatus(null);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // Update WPM and accuracy
  useEffect(() => {
    if (startTime && race?.status === 'started') {
      const elapsed = (Date.now() - startTime) / 1000 / 60;
      const currentWpm = Math.round(correctWords / elapsed) || 0;
      setWpm(currentWpm);
      
      const totalTyped = correctWords + incorrectWords;
      const acc = totalTyped > 0 ? Math.round((correctWords / totalTyped) * 100) : 100;
      setAccuracy(acc);
    }
  }, [correctWords, incorrectWords, startTime, race?.status]);

  const findRace = () => {
    if (!socket || !user) return;
    
    socket.emit('find-race', {
      userId: user._id,
      username: user.username,
      mode: 'normal'
    });
    
    setMatchmakingStatus({ status: 'searching', message: 'Finding opponents...' });
  };

  const cancelMatchmaking = () => {
    if (!socket) return;
    
    socket.emit('cancel-matchmaking');
    setMatchmakingStatus(null);
  };

  const handleInputChange = (e) => {
    if (race?.status !== 'started') return;

    const value = e.target.value;

    // Check if space is pressed to submit word
    if (value.endsWith(' ')) {
      submitWord(value.trim());
    } else {
      setInput(value);
    }
  };

  const submitWord = (typedWord) => {
    if (currentWordIndex >= words.length) return;

    const targetWord = words[currentWordIndex];
    const newStatuses = [...wordStatuses];
    
    let isCorrect = false;
    if (typedWord === targetWord) {
      newStatuses[currentWordIndex] = 'correct';
      isCorrect = true;
    } else {
      newStatuses[currentWordIndex] = 'incorrect';
    }
    
    setWordStatuses(newStatuses);
    setInput('');
    
    const nextIndex = currentWordIndex + 1;
    setCurrentWordIndex(nextIndex);
    
    // Calculate stats with the new word included
    const newCorrectWords = correctWords + (isCorrect ? 1 : 0);
    const newIncorrectWords = incorrectWords + (isCorrect ? 0 : 1);
    
    // Update state
    if (isCorrect) {
      setCorrectWords(newCorrectWords);
    } else {
      setIncorrectWords(newIncorrectWords);
    }
    
    // Calculate progress and update server
    const progress = Math.round((nextIndex / words.length) * 100);
    const elapsed = (Date.now() - startTime) / 1000 / 60;
    const currentWpm = Math.round(newCorrectWords / elapsed) || 0;
    const totalTyped = newCorrectWords + newIncorrectWords;
    const acc = totalTyped > 0 ? Math.round((newCorrectWords / totalTyped) * 100) : 100;
    
    socket.emit('update-progress', {
      roomCode: race.roomCode,
      userId: user._id,
      progress,
      wpm: currentWpm,
      accuracy: acc
    });
    
    // Check if all words are completed
    if (nextIndex >= words.length) {
      socket.emit('finish-race', {
        roomCode: race.roomCode,
        userId: user._id
      });
    }
  };

  const renderText = () => {
    return words.map((word, index) => {
      let className = 'word-box word-pending';
      
      if (wordStatuses[index] === 'correct') {
        className = 'word-box word-correct';
      } else if (wordStatuses[index] === 'incorrect') {
        className = 'word-box word-incorrect';
      } else if (index === currentWordIndex) {
        className = 'word-box word-current';
      }

      return (
        <span key={index} className={className}>
          {word}
        </span>
      );
    });
  };

  // Matchmaking lobby
  if (!race) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Multiplayer Race 🏁</h1>

        <div className="max-w-2xl mx-auto">
          {!matchmakingStatus ? (
            <div className="card text-center">
              <p className="mb-6 text-gray-600 dark:text-gray-400 text-lg">
                Join the matchmaking queue to race against other players or bots!
              </p>
              <button 
                onClick={findRace} 
                className="btn-primary text-lg px-8 py-3"
              >
                🏁 Find Race
              </button>
            </div>
          ) : (
            <div className="card text-center">
              <div className="mb-6">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
              </div>
              <p className="text-xl font-semibold mb-4">{matchmakingStatus.message}</p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Searching for opponents...
              </p>
              <button 
                onClick={cancelMatchmaking} 
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show countdown
  if (countdown !== null && countdown >= 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="card text-center mb-6">
            <h2 className="text-6xl font-bold mb-4 text-primary-600 dark:text-primary-400">
              {countdown === 0 ? 'GO!' : countdown}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Race starting in {countdown}...
            </p>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold mb-4">Racers ({race.participants.length})</h3>
            <div className="space-y-2">
              {race.participants.map((participant) => (
                <div
                  key={participant.userId}
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span className="text-2xl">
                    {participant.isBot ? '🤖' : '👤'}
                  </span>
                  <span className="font-semibold">{participant.username}</span>
                  {participant.isBot && (
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded">
                      Bot
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Racing UI
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Race Room: {race.roomCode}</h1>
          <div className="flex items-center space-x-4">
            <span className={`px-4 py-2 rounded-lg font-semibold ${
              race.status === 'countdown' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
              race.status === 'started' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
              'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
            }`}>
              {race.status === 'countdown' ? 'Starting...' : race.status === 'started' ? 'Racing' : 'Finished'}
            </span>
          </div>
        </div>

        <div className="card mb-6">
          <h3 className="text-xl font-bold mb-4">Racers ({race.participants.length})</h3>
          <div className="space-y-2">
            {race.participants.map((participant) => (
              <div
                key={participant.userId}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {participant.isBot ? '🤖' : '👤'}
                  </span>
                  <span className="font-semibold">{participant.username}</span>
                  {participant.isBot && (
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded">
                      Bot
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-6">
                  {/* Progress bar */}
                  <div className="w-48 bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                    <div 
                      className="bg-primary-600 dark:bg-primary-400 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${participant.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-sm w-16 text-right">
                    <span className="font-bold">{participant.progress}%</span>
                  </div>
                  {race.status === 'started' && (
                    <>
                      <div className="text-sm w-20 text-right">
                        <span className="text-gray-600 dark:text-gray-400">WPM: </span>
                        <span className="font-bold">{participant.wpm}</span>
                      </div>
                    </>
                  )}
                  {race.status === 'finished' && participant.position && (
                    <div className="text-2xl w-12 text-right">
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

            <div className="word-container select-none mb-4">
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
              </span> {race.participants.find(p => p.position === 1)?.isBot ? '🤖' : '🏆'}
            </div>
            <button onClick={() => {
              setRace(null);
              setCountdown(null);
              setInput('');
              setCurrentWordIndex(0);
              setWordStatuses([]);
              setWords([]);
              setCorrectWords(0);
              setIncorrectWords(0);
              setStartTime(null);
              setWpm(0);
              setAccuracy(100);
            }} className="btn-primary">
              Back to Lobby
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RacePage;
