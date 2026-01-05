import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TypingTest from './pages/TypingTest';
import CodeTypingTest from './pages/CodeTypingTest';
import RacePage from './pages/RacePage';
import LeaderboardPage from './pages/LeaderboardPage';
import Profile from './pages/Profile';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/test/normal" element={
                  <ProtectedRoute>
                    <TypingTest />
                  </ProtectedRoute>
                } />
                
                <Route path="/test/code" element={
                  <ProtectedRoute>
                    <CodeTypingTest />
                  </ProtectedRoute>
                } />
                
                <Route path="/race" element={
                  <ProtectedRoute>
                    <RacePage />
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
