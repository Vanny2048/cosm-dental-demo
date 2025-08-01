import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import './BuddyChat.css';

const BuddyChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useUser();

  // GenZ prompt suggestions
  const promptSuggestions = [
    "What's the best late-night food on campus?",
    "How do I join Greek life?",
    "What's happening this weekend?",
    "Where's the best study spot?"
  ];

  // Mock chatbot responses for development
  const mockResponses = {
    "What's the best late-night food on campus?": "Omg the Lair is literally the GOAT for late night munchies! 🍕 Their pizza hits different at 2am, and the fries are *chef's kiss*. Also, the Den has some fire chicken tenders if you're feeling that vibe. Pro tip: bring your student ID for the discount! 💅✨",
    
    "How do I join Greek life?": "Yasss Greek life is where it's at! 🏛️ First, go to the Greek Life mixer this Friday (I'll send you the deets). Then check out rush week in the spring - it's like a whole vibe! Each house has their own personality, so go to as many events as you can. My friend Sarah just joined Alpha Phi and she's living her best life! DM me if you want the tea on specific houses 👀",
    
    "What's happening this weekend?": "This weekend is gonna be LIT! 🔥 Friday we have the basketball game vs USC (wear your LMU gear!), Saturday is the Greek mixer in the Sunken Garden, and Sunday there's a study session at the library for finals prep. Plus, there's a campus spirit challenge going on - you can earn points and prizes! Are you going to any of these? I can give you the full tea ☕",
    
    "Where's the best study spot?": "The library is obviously the classic choice, but here's the real tea: 🫖 The 3rd floor of the library has the best views and is usually quieter. The Den has great vibes if you want background noise, and the new student center has these amazing pods that are perfect for group study sessions. My secret spot? The rooftop of the business building - it's so aesthetic and peaceful! 📚✨"
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          type: 'bot',
          content: `Hey ${user?.name || 'Lion'}! 🦁 I'm your LMU GenZ Buddy - your go-to for all things campus life! Ask me anything about events, food, study spots, Greek life, or just general LMU vibes. I'm here to help you live your best college life! ✨`,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, user?.name]);

  const sendMessage = async (content) => {
    if (!content.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get mock response or generate one
      let botResponse = mockResponses[content] || 
        "That's a great question! 🤔 Let me think... Honestly, I'm still learning about everything on campus, but I'd recommend checking out the student activities page or asking around! The LMU community is super helpful. What else can I help you with? 💫";

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "Oops! Something went wrong. 😅 Try asking me something else!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        className="buddy-chat-button"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      >
        <span className="buddy-icon">🦁</span>
        <span className="buddy-text">Ask Buddy</span>
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="buddy-chat-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="buddy-chat-modal"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-avatar">
                  <span className="avatar-icon">🦁</span>
                </div>
                <div className="chat-info">
                  <h3 className="chat-title">LMU GenZ Buddy</h3>
                  <p className="chat-subtitle">Your campus bestie ✨</p>
                </div>
                <button 
                  className="chat-close"
                  onClick={() => setIsOpen(false)}
                >
                  ✕
                </button>
              </div>

              {/* Chat Messages */}
              <div className="chat-messages">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`message ${message.type}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="message-content">
                      {message.content}
                    </div>
                    <div className="message-time">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div
                    className="message bot loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Prompt Suggestions */}
              {messages.length === 1 && (
                <div className="prompt-suggestions">
                  <p className="suggestions-title">Try asking me:</p>
                  <div className="suggestions-grid">
                    {promptSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="suggestion-button"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input */}
              <form className="chat-input-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Ask me anything about LMU life..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  className="chat-send"
                  disabled={!inputValue.trim() || isLoading}
                >
                  <span className="send-icon">💬</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BuddyChat;