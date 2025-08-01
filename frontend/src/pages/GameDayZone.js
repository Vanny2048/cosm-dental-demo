import React from 'react';
import { motion } from 'framer-motion';

const GameDayZone = () => {
  return (
    <div className="page-container">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Game Day Zone</h1>
          <p>Check-in (QR/geolocation), live spirit meter, challenge uploads (photo/vid), watch party map.</p>
          <p>🏀 Coming Soon! 🏀</p>
        </motion.div>
      </div>
    </div>
  );
};

export default GameDayZone;