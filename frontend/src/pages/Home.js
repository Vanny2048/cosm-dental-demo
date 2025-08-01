import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { useEvents } from '../context/EventContext';
import './Home.css';

const Home = () => {
  const { user, addPoints } = useUser();
  const { events, getUpcomingEvents } = useEvents();

  const upcomingEvents = getUpcomingEvents();
  const nextBigEvent = upcomingEvents[0];

  const dailyChallenge = {
    title: "Campus Spirit Challenge",
    description: "Take a photo with LMU gear and post it!",
    points: 50,
    icon: "📸"
  };

  const handleChallengeComplete = () => {
    addPoints(dailyChallenge.points, "Daily Spirit Challenge");
  };

  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your campus experience...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="container">
        {/* Hero Section */}
        <motion.section 
          className="hero-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome back, {user.name}! 🦁
            </h1>
            <p className="hero-subtitle">
              Ready to make today legendary?
            </p>
          </div>
          
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-value">{user.points}</div>
              <div className="stat-label">Points</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">#{user.rank}</div>
              <div className="stat-label">Rank</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{user.streak}</div>
              <div className="stat-label">Day Streak</div>
            </div>
          </div>
        </motion.section>

        {/* Next Big Event Banner */}
        {nextBigEvent && (
          <motion.section 
            className="event-banner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="banner-content">
              <div className="banner-info">
                <div className="event-type-badge">
                  <span className="event-icon">🏀</span>
                  <span className="event-type">Next Big Event</span>
                </div>
                <h2 className="event-title">{nextBigEvent.title}</h2>
                <p className="event-details">
                  <span className="event-date">
                    {new Date(nextBigEvent.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span className="event-location">📍 {nextBigEvent.location}</span>
                </p>
                <div className="event-attendees">
                  <span className="attendee-count">{nextBigEvent.attendees.length} attending</span>
                  <span className="event-points">+{nextBigEvent.points} points</span>
                </div>
              </div>
              <div className="banner-image">
                <img src={nextBigEvent.image} alt={nextBigEvent.title} />
                <div className="banner-overlay"></div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Daily Spirit Challenge */}
        <motion.section 
          className="challenge-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="challenge-card">
            <div className="challenge-header">
              <div className="challenge-icon">{dailyChallenge.icon}</div>
              <div className="challenge-info">
                <h3 className="challenge-title">{dailyChallenge.title}</h3>
                <p className="challenge-description">{dailyChallenge.description}</p>
              </div>
            </div>
            <div className="challenge-actions">
              <button 
                className="btn btn-primary"
                onClick={handleChallengeComplete}
              >
                Complete Challenge
              </button>
              <span className="challenge-points">+{dailyChallenge.points} points</span>
            </div>
          </div>
        </motion.section>

        {/* Live Events Preview */}
        <motion.section 
          className="events-preview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="section-header">
            <h2 className="section-title">Live Events</h2>
            <a href="/events" className="view-all-link">View All</a>
          </div>
          
          <div className="events-grid">
            {upcomingEvents.slice(0, 3).map((event, index) => (
              <motion.div
                key={event.id}
                className="event-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="event-image">
                  <img src={event.image} alt={event.title} />
                  <div className="event-type-overlay">
                    <span className="event-type-icon">{event.type === 'game' ? '🏀' : '🎉'}</span>
                  </div>
                </div>
                <div className="event-content">
                  <h3 className="event-card-title">{event.title}</h3>
                  <p className="event-card-date">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="event-card-location">{event.location}</p>
                  <div className="event-card-footer">
                    <span className="event-attendees-count">
                      {event.attendees.length} attending
                    </span>
                    <span className="event-points-badge">+{event.points}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section 
          className="quick-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="actions-grid">
            <motion.a 
              href="/game-day" 
              className="action-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="action-icon">🏀</div>
              <h3 className="action-title">Game Day</h3>
              <p className="action-description">Check in & earn points</p>
            </motion.a>
            
            <motion.a 
              href="/leaderboard" 
              className="action-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="action-icon">🏆</div>
              <h3 className="action-title">Leaderboard</h3>
              <p className="action-description">See your ranking</p>
            </motion.a>
            
            <motion.a 
              href="/prizes" 
              className="action-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="action-icon">🎁</div>
              <h3 className="action-title">Prizes</h3>
              <p className="action-description">Redeem your points</p>
            </motion.a>
            
            <motion.a 
              href="/host" 
              className="action-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="action-icon">🎪</div>
              <h3 className="action-title">Host Event</h3>
              <p className="action-description">Create something amazing</p>
            </motion.a>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Home;