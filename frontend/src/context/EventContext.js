import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const EventContext = createContext();

// Initial state
const initialState = {
  events: [],
  upcomingEvents: [],
  myEvents: [],
  loading: false,
  selectedEvent: null,
  eventTypes: [
    { id: 'game', name: 'Game Day', color: '#8C1515', icon: '🏀' },
    { id: 'social', name: 'Social', color: '#D4AF37', icon: '🎉' },
    { id: 'academic', name: 'Academic', color: '#1B365D', icon: '📚' },
    { id: 'greek', name: 'Greek Life', color: '#B84A4A', icon: '🏛️' },
    { id: 'rso', name: 'RSO', color: '#10B981', icon: '👥' },
    { id: 'spirit', name: 'Spirit', color: '#F59E0B', icon: '🦁' }
  ]
};

// Action types
const EVENT_ACTIONS = {
  SET_EVENTS: 'SET_EVENTS',
  SET_LOADING: 'SET_LOADING',
  SET_SELECTED_EVENT: 'SET_SELECTED_EVENT',
  RSVP_EVENT: 'RSVP_EVENT',
  CHECK_IN_EVENT: 'CHECK_IN_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  UPDATE_EVENT: 'UPDATE_EVENT',
  DELETE_EVENT: 'DELETE_EVENT'
};

// Reducer
function eventReducer(state, action) {
  switch (action.type) {
    case EVENT_ACTIONS.SET_EVENTS:
      return {
        ...state,
        events: action.payload,
        upcomingEvents: action.payload.filter(event => 
          new Date(event.date) > new Date()
        ).sort((a, b) => new Date(a.date) - new Date(b.date))
      };
    
    case EVENT_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case EVENT_ACTIONS.SET_SELECTED_EVENT:
      return {
        ...state,
        selectedEvent: action.payload
      };
    
    case EVENT_ACTIONS.RSVP_EVENT:
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.eventId
            ? {
                ...event,
                attendees: event.attendees.includes(action.payload.userId)
                  ? event.attendees.filter(id => id !== action.payload.userId)
                  : [...event.attendees, action.payload.userId]
              }
            : event
        )
      };
    
    case EVENT_ACTIONS.CHECK_IN_EVENT:
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.eventId
            ? {
                ...event,
                checkedIn: [...(event.checkedIn || []), action.payload.userId]
              }
            : event
        )
      };
    
    case EVENT_ACTIONS.ADD_EVENT:
      return {
        ...state,
        events: [...state.events, action.payload]
      };
    
    case EVENT_ACTIONS.UPDATE_EVENT:
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id ? action.payload : event
        )
      };
    
    case EVENT_ACTIONS.DELETE_EVENT:
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload)
      };
    
    default:
      return state;
  }
}

// Provider component
export function EventProvider({ children }) {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  // Mock events data
  useEffect(() => {
    const mockEvents = [
      {
        id: 1,
        title: 'LMU vs USC Basketball Game',
        type: 'game',
        date: '2024-02-15T19:00:00',
        location: 'Gersten Pavilion',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=250&fit=crop',
        host: 'LMU Athletics',
        description: 'Come support the Lions as they take on USC! Wear your LMU gear and show your school spirit!',
        attendees: [1, 2, 3, 4, 5],
        maxCapacity: 500,
        checkedIn: [1, 2],
        points: 100,
        tags: ['basketball', 'game-day', 'spirit']
      },
      {
        id: 2,
        title: 'Greek Life Mixer',
        type: 'greek',
        date: '2024-02-16T20:00:00',
        location: 'Sunken Garden',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=250&fit=crop',
        host: 'Greek Council',
        description: 'Join us for an evening of networking and fun with all Greek organizations!',
        attendees: [1, 3, 6, 7, 8],
        maxCapacity: 200,
        checkedIn: [],
        points: 75,
        tags: ['greek', 'social', 'networking']
      },
      {
        id: 3,
        title: 'Study Session: Finals Prep',
        type: 'academic',
        date: '2024-02-17T14:00:00',
        location: 'William H. Hannon Library',
        image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=250&fit=crop',
        host: 'Academic Success Center',
        description: 'Get ready for finals with study groups, snacks, and academic support!',
        attendees: [1, 4, 9, 10],
        maxCapacity: 100,
        checkedIn: [],
        points: 50,
        tags: ['academic', 'study', 'finals']
      },
      {
        id: 4,
        title: 'Campus Spirit Challenge',
        type: 'spirit',
        date: '2024-02-18T12:00:00',
        location: 'LMU Campus',
        image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=400&h=250&fit=crop',
        host: 'Student Activities',
        description: 'Complete campus-wide challenges to earn points and show your LMU pride!',
        attendees: [1, 2, 5, 6, 7, 8, 9],
        maxCapacity: 300,
        checkedIn: [1],
        points: 150,
        tags: ['spirit', 'challenge', 'campus']
      },
      {
        id: 5,
        title: 'RSO Fair',
        type: 'rso',
        date: '2024-02-19T15:00:00',
        location: 'Regents Terrace',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop',
        host: 'Student Leadership',
        description: 'Discover and join student organizations that match your interests!',
        attendees: [1, 3, 4, 5, 6],
        maxCapacity: 250,
        checkedIn: [],
        points: 60,
        tags: ['rso', 'clubs', 'involvement']
      },
      {
        id: 6,
        title: 'Tailgate Party',
        type: 'social',
        date: '2024-02-20T17:00:00',
        location: 'Parking Lot A',
        image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=400&h=250&fit=crop',
        host: 'Student Government',
        description: 'Pre-game celebration with food, music, and games before the big match!',
        attendees: [1, 2, 3, 4, 5, 6, 7, 8],
        maxCapacity: 400,
        checkedIn: [],
        points: 80,
        tags: ['tailgate', 'social', 'pre-game']
      }
    ];

    dispatch({ type: EVENT_ACTIONS.SET_EVENTS, payload: mockEvents });
  }, []);

  // Actions
  const rsvpEvent = async (eventId, userId) => {
    try {
      dispatch({ type: EVENT_ACTIONS.RSVP_EVENT, payload: { eventId, userId } });
      
      const event = state.events.find(e => e.id === eventId);
      const isAttending = event.attendees.includes(userId);
      
      if (isAttending) {
        toast.success('RSVP cancelled');
      } else {
        toast.success('RSVP confirmed! 🎉');
      }
    } catch (error) {
      toast.error('Failed to update RSVP');
    }
  };

  const checkInEvent = async (eventId, userId) => {
    try {
      dispatch({ type: EVENT_ACTIONS.CHECK_IN_EVENT, payload: { eventId, userId } });
      toast.success('Check-in successful! +50 points 🎉');
    } catch (error) {
      toast.error('Check-in failed');
    }
  };

  const createEvent = async (eventData) => {
    try {
      const newEvent = {
        id: Date.now(),
        ...eventData,
        attendees: [],
        checkedIn: [],
        createdAt: new Date().toISOString()
      };
      
      dispatch({ type: EVENT_ACTIONS.ADD_EVENT, payload: newEvent });
      toast.success('Event created successfully! 🎉');
      return newEvent;
    } catch (error) {
      toast.error('Failed to create event');
      throw error;
    }
  };

  const updateEvent = async (eventId, updates) => {
    try {
      const updatedEvent = { ...updates, id: eventId };
      dispatch({ type: EVENT_ACTIONS.UPDATE_EVENT, payload: updatedEvent });
      toast.success('Event updated successfully!');
    } catch (error) {
      toast.error('Failed to update event');
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      dispatch({ type: EVENT_ACTIONS.DELETE_EVENT, payload: eventId });
      toast.success('Event deleted successfully');
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const getEventType = (typeId) => {
    return state.eventTypes.find(type => type.id === typeId);
  };

  const getMyEvents = (userId) => {
    return state.events.filter(event => 
      event.attendees.includes(userId) || event.host === userId
    );
  };

  const getUpcomingEvents = () => {
    return state.events.filter(event => 
      new Date(event.date) > new Date()
    ).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const value = {
    ...state,
    rsvpEvent,
    checkInEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventType,
    getMyEvents,
    getUpcomingEvents
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
}

// Hook to use the context
export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}