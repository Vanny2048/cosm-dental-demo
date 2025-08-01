import React from 'react';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  return (
    <div className="page-container">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Leaderboard</h1>
          <p>Ranks for individuals/orgs, badge ribbons, animated movement, "How I Rank" modals.</p>
          <p>🏆 Coming Soon! 🏆</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;