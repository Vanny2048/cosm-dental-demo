import React from 'react';
import { motion } from 'framer-motion';

const Prizes = () => {
  return (
    <div className="page-container">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Prizes</h1>
          <p>Grid of prizes (images, point values), claim & status, prize idea suggestions form.</p>
          <p>🎁 Coming Soon! 🎁</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Prizes;