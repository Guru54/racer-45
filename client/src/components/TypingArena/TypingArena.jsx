import { useState, useEffect, useRef } from 'react';

const TypingArena = ({ text, onComplete, duration = 60 }) => {
  const [input, setInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState(0);
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
  }, []);

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
      const wordsTyped = input.trim().split(/\s+/).length;
      const currentWpm = Math.round(wordsTyped / elapsed) || 0;
      setWpm(currentWpm);
    }
  }, [input, startTime, isActive]);

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (!isActive && value.length === 1) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    if (value.length > text.length) {
      return;
    }

    setInput(value);
    setCurrentIndex(value.length);

    let errorCount = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== text[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);

    const acc = value.length > 0 ? Math.round(((value.length - errorCount) / value.length) * 100) : 100;
    setAccuracy(acc);

    if (value === text) {
      finishTest();
    }
  };

  const finishTest = () => {
    setIsActive(false);
    const timeTaken = duration - timeLeft;
    onComplete({
      wpm,
      accuracy,
      errors,
      duration: timeTaken,
      textContent: text
    });
  };

  const restart = () => {
    setInput('');
    setCurrentIndex(0);
    setErrors(0);
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
    return text.split('').map((char, index) => {
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
              {errors}
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
        <div className="text-2xl leading-relaxed font-mono mb-4 select-none">
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
