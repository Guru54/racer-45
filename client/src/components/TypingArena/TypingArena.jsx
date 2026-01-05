import { useState, useEffect, useRef } from 'react';

const TypingArena = ({ text, onComplete, duration = 60 }) => {
  const [input, setInput] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordStatuses, setWordStatuses] = useState([]);
  const [words, setWords] = useState([]);
  const [correctWords, setCorrectWords] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Initialize words array from text
    const wordArray = text.trim().split(/\s+/);
    setWords(wordArray);
    setWordStatuses(new Array(wordArray.length).fill('pending'));
  }, [text]);

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            finishTest();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (startTime && isActive) {
      const elapsed = (Date.now() - startTime) / 1000 / 60;
      const currentWpm = Math.round(correctWords / elapsed) || 0;
      setWpm(currentWpm);
      
      const totalTyped = correctWords + incorrectWords;
      const acc = totalTyped > 0 ? Math.round((correctWords / totalTyped) * 100) : 100;
      setAccuracy(acc);
    }
  }, [correctWords, incorrectWords, startTime, isActive]);

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (!isActive && value.length === 1) {
      setIsActive(true);
      setStartTime(Date.now());
    }

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
    
    if (typedWord === targetWord) {
      newStatuses[currentWordIndex] = 'correct';
      setCorrectWords(prev => prev + 1);
    } else {
      newStatuses[currentWordIndex] = 'incorrect';
      setIncorrectWords(prev => prev + 1);
    }
    
    setWordStatuses(newStatuses);
    setInput('');
    
    const nextIndex = currentWordIndex + 1;
    setCurrentWordIndex(nextIndex);
    
    // Check if all words are completed
    if (nextIndex >= words.length) {
      finishTest();
    }
  };

  const finishTest = () => {
    setIsActive(false);
    const timeTaken = duration - timeLeft;
    onComplete({
      wpm,
      accuracy,
      errors: incorrectWords,
      duration: timeTaken,
      textContent: text
    });
  };

  const restart = () => {
    setInput('');
    setCurrentWordIndex(0);
    setWordStatuses(new Array(words.length).fill('pending'));
    setCorrectWords(0);
    setIncorrectWords(0);
    setStartTime(null);
    setTimeLeft(duration);
    setIsActive(false);
    setWpm(0);
    setAccuracy(100);
    if (inputRef.current) {
      inputRef.current.focus();
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-6">
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
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {incorrectWords}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Errors</div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {timeLeft}s
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Time Left</div>
        </div>
      </div>

      <div className="card">
        <div className="word-container select-none">
          {renderText()}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          disabled={!isActive && timeLeft === 0}
          className="input-field font-mono text-lg"
          placeholder="Start typing..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>

      <div className="flex justify-center">
        <button onClick={restart} className="btn-secondary">
          Restart
        </button>
      </div>
    </div>
  );
};

export default TypingArena;
