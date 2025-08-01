import React from 'react';
import { motion } from 'framer-motion';

const Events = () => {
  return (
    <div className="page-container">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Events</h1>
          <p>Card/calendar view of all events, colored by type, 1-click RSVP, map, social "who's going" info.</p>
          <p>🚧 Coming Soon! 🚧</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Events;