import React from 'react';
import { motion } from 'framer-motion';

const Notifications = () => {
  return (
    <div className="page-container">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Notifications</h1>
          <p>RSVP reminders, leaderboard changes, claim prompts, custom settings for push messages.</p>
          <p>🔔 Coming Soon! 🔔</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Notifications;