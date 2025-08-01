import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const UserContext = createContext();

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  points: 0,
  rank: null,
  badges: [],
  streak: 0,
  orgs: [],
  notifications: []
};

// Action types
const USER_ACTIONS = {
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  UPDATE_POINTS: 'UPDATE_POINTS',
  ADD_BADGE: 'ADD_BADGE',
  UPDATE_STREAK: 'UPDATE_STREAK',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  CLEAR_NOTIFICATION: 'CLEAR_NOTIFICATION',
  LOGOUT: 'LOGOUT'
};

// Reducer
function userReducer(state, action) {
  switch (action.type) {
    case USER_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false
      };
    
    case USER_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case USER_ACTIONS.UPDATE_POINTS:
      return {
        ...state,
        points: action.payload,
        user: state.user ? { ...state.user, points: action.payload } : null
      };
    
    case USER_ACTIONS.ADD_BADGE:
      return {
        ...state,
        badges: [...state.badges, action.payload],
        user: state.user ? { 
          ...state.user, 
          badges: [...(state.user.badges || []), action.payload] 
        } : null
      };
    
    case USER_ACTIONS.UPDATE_STREAK:
      return {
        ...state,
        streak: action.payload,
        user: state.user ? { ...state.user, streak: action.payload } : null
      };
    
    case USER_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };
    
    case USER_ACTIONS.CLEAR_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    
    case USER_ACTIONS.LOGOUT:
      return {
        ...initialState,
        loading: false
      };
    
    default:
      return state;
  }
}

// Provider component
export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Mock user data for development
  useEffect(() => {
    const mockUser = {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex.johnson@lmu.edu',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      points: 1250,
      rank: 15,
      streak: 7,
      orgs: ['Greek Life', 'Student Government', 'Basketball Club'],
      badges: [
        { id: 1, name: 'First Event', icon: '🎉', description: 'Attended your first event' },
        { id: 2, name: 'Week Warrior', icon: '🔥', description: '7-day streak' },
        { id: 3, name: 'Social Butterfly', icon: '🦋', description: 'Joined 3+ organizations' }
      ],
      notifications: [
        { id: 1, type: 'event', message: 'Basketball game starts in 30 minutes!', read: false },
        { id: 2, type: 'points', message: '+50 points for checking in!', read: false }
      ]
    };

    // Simulate loading
    setTimeout(() => {
      dispatch({ type: USER_ACTIONS.SET_USER, payload: mockUser });
    }, 1000);
  }, []);

  // Actions
  const login = async (email, password) => {
    try {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: 1,
        name: 'Alex Johnson',
        email: email,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        points: 1250,
        rank: 15,
        streak: 7,
        orgs: ['Greek Life', 'Student Government', 'Basketball Club'],
        badges: [
          { id: 1, name: 'First Event', icon: '🎉', description: 'Attended your first event' },
          { id: 2, name: 'Week Warrior', icon: '🔥', description: '7-day streak' },
          { id: 3, name: 'Social Butterfly', icon: '🦋', description: 'Joined 3+ organizations' }
        ]
      };
      
      dispatch({ type: USER_ACTIONS.SET_USER, payload: mockUser });
      toast.success('Welcome back, Alex! 🦁');
      
    } catch (error) {
      toast.error('Login failed. Please try again.');
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const logout = () => {
    dispatch({ type: USER_ACTIONS.LOGOUT });
    toast.success('See you later! 👋');
  };

  const addPoints = (points, reason) => {
    const newPoints = state.points + points;
    dispatch({ type: USER_ACTIONS.UPDATE_POINTS, payload: newPoints });
    
    // Add notification
    dispatch({
      type: USER_ACTIONS.ADD_NOTIFICATION,
      payload: {
        id: Date.now(),
        type: 'points',
        message: `+${points} points for ${reason}!`,
        read: false,
        timestamp: new Date()
      }
    });
    
    toast.success(`+${points} points! ${reason} 🎉`);
  };

  const addBadge = (badge) => {
    dispatch({ type: USER_ACTIONS.ADD_BADGE, payload: badge });
    toast.success(`New badge unlocked: ${badge.name} ${badge.icon}`);
  };

  const updateStreak = (streak) => {
    dispatch({ type: USER_ACTIONS.UPDATE_STREAK, payload: streak });
  };

  const addNotification = (notification) => {
    dispatch({
      type: USER_ACTIONS.ADD_NOTIFICATION,
      payload: {
        id: Date.now(),
        timestamp: new Date(),
        read: false,
        ...notification
      }
    });
  };

  const clearNotification = (id) => {
    dispatch({ type: USER_ACTIONS.CLEAR_NOTIFICATION, payload: id });
  };

  const value = {
    ...state,
    login,
    logout,
    addPoints,
    addBadge,
    updateStreak,
    addNotification,
    clearNotification
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Hook to use the context
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}