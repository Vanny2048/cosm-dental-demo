import React from 'react';
import { motion } from 'framer-motion';

const Profile = () => {
  return (
    <div className="page-container">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Profile</h1>
          <p>Avatar/points/streaks, badge gallery, events attended, RSVP status, edit options.</p>
          <p>👤 Coming Soon! 👤</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;