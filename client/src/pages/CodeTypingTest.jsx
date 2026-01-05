import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import TypingArena from '../components/TypingArena/TypingArena';
import { generateCodeText } from '../utils/textGenerator';

const CodeTypingTest = () => {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [duration, setDuration] = useState(60);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    generateNewText();
  }, [language]);

  const generateNewText = () => {
    const newText = generateCodeText(language);
    setText(newText);
    setShowResults(false);
    setResults(null);
  };

  const handleComplete = async (testResults) => {
    setResults(testResults);
    setShowResults(true);

    try {
      await axios.post(`${API_URL}/api/tests`, {
        mode: 'code',
        language,
        wpm: testResults.wpm,
        accuracy: testResults.accuracy,
        errors: testResults.errors,
        duration: testResults.duration,
        textContent: testResults.textContent
      });
      toast.success('Test results saved!');
    } catch (error) {
      toast.error('Failed to save results');
      console.error(error);
    }
  };

  const languages = ['javascript', 'python', 'java', 'c', 'cpp'];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Code Typing Test</h1>
          
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input-field w-48"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {!showResults ? (
          text && <TypingArena text={text} onComplete={handleComplete} duration={duration} />
        ) : (
          <div className="card space-y-6">
            <h2 className="text-3xl font-bold text-center mb-6">Test Complete! 🎉</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                  {results.wpm}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">WPM</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                  {results.accuracy}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Accuracy</div>
              </div>
              
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-4xl font-bold text-red-600 dark:text-red-400">
                  {results.errors}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Errors</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  {results.duration}s
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Time</div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button onClick={generateNewText} className="btn-primary">
                Try Again
              </button>
              <button onClick={() => navigate('/dashboard')} className="btn-secondary">
                View Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeTypingTest;
