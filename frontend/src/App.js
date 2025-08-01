import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Layout Components
import Navigation from './components/Navigation';
import BuddyChat from './components/BuddyChat';
import WaitlistSignup from './components/WaitlistSignup';

// Page Components
import Home from './pages/Home';
import Events from './pages/Events';
import GameDayZone from './pages/GameDayZone';
import Leaderboard from './pages/Leaderboard';
import Prizes from './pages/Prizes';
import Profile from './pages/Profile';
import HostZone from './pages/HostZone';
import Notifications from './pages/Notifications';

// Context
import { useUser } from './context/UserContext';

function App() {
  const { user } = useUser();
  const [showWaitlist, setShowWaitlist] = React.useState(false);

  return (
    <div className="App">
      <Navigation />
      
      {/* Waitlist Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 text-center">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🦁</span>
            <div>
              <p className="font-semibold">LMU Campus LLM is coming soon!</p>
              <p className="text-sm opacity-90">Join the waitlist to be first in line</p>
            </div>
          </div>
          <button
            onClick={() => setShowWaitlist(true)}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Join Waitlist
          </button>
        </div>
      </div>
      
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Home />
                </motion.div>
              } 
            />
            <Route 
              path="/events" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Events />
                </motion.div>
              } 
            />
            <Route 
              path="/game-day" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <GameDayZone />
                </motion.div>
              } 
            />
            <Route 
              path="/leaderboard" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Leaderboard />
                </motion.div>
              } 
            />
            <Route 
              path="/prizes" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Prizes />
                </motion.div>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Profile />
                </motion.div>
              } 
            />
            <Route 
              path="/host" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <HostZone />
                </motion.div>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Notifications />
                </motion.div>
              } 
            />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Floating Buddy Chat Button */}
      <BuddyChat />
      
      {/* Waitlist Signup Modal */}
      <WaitlistSignup 
        isVisible={showWaitlist}
        onClose={() => setShowWaitlist(false)}
      />
    </div>
  );
}

export default App;