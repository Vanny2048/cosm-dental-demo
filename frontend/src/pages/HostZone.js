import React from 'react';
import { motion } from 'framer-motion';

const HostZone = () => {
  return (
    <div className="page-container">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Host Zone</h1>
          <p>Event submission form (title, type, date, image), status dashboard, quick preview.</p>
          <p>🎪 Coming Soon! 🎪</p>
        </motion.div>
      </div>
    </div>
  );
};

export default HostZone;