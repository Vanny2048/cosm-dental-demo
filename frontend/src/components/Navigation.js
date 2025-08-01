import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import './Navigation.css';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, notifications } = useUser();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/events', label: 'Events', icon: '📅' },
    { path: '/game-day', label: 'Game Day', icon: '🏀' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { path: '/prizes', label: 'Prizes', icon: '🎁' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/host', label: 'Host', icon: '🎪' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' }
  ];

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="nav-desktop">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <div className="logo-icon">🦁</div>
            <div className="logo-text">
              <span className="logo-title">LMU Campus</span>
              <span className="logo-subtitle">LLM</span>
            </div>
          </Link>

          <div className="nav-menu">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.path === '/notifications' && unreadNotifications > 0 && (
                  <span className="notification-badge">{unreadNotifications}</span>
                )}
              </Link>
            ))}
          </div>

          {user && (
            <div className="nav-user">
              <div className="user-info">
                <span className="user-points">{user.points} pts</span>
                <span className="user-rank">#{user.rank}</span>
              </div>
              <img src={user.avatar} alt={user.name} className="user-avatar" />
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="nav-mobile">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <div className="logo-icon">🦁</div>
            <span className="logo-text">LMU Campus LLM</span>
          </Link>

          <button 
            className={`hamburger ${isOpen ? 'active' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <motion.div 
          className={`nav-menu-mobile ${isOpen ? 'open' : ''}`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isOpen ? 'auto' : 0, 
            opacity: isOpen ? 1 : 0 
          }}
          transition={{ duration: 0.3 }}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item-mobile ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.path === '/notifications' && unreadNotifications > 0 && (
                <span className="notification-badge">{unreadNotifications}</span>
              )}
            </Link>
          ))}
          
          {user && (
            <div className="nav-user-mobile">
              <div className="user-info">
                <img src={user.avatar} alt={user.name} className="user-avatar" />
                <div className="user-details">
                  <span className="user-name">{user.name}</span>
                  <span className="user-points">{user.points} points • Rank #{user.rank}</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </nav>

      {/* Bottom Navigation for Mobile */}
      <nav className="nav-bottom">
        <div className="nav-bottom-container">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-bottom-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-bottom-icon">{item.icon}</span>
              <span className="nav-bottom-label">{item.label}</span>
              {item.path === '/notifications' && unreadNotifications > 0 && (
                <span className="notification-badge-bottom">{unreadNotifications}</span>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navigation;