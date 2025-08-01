import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import './BuddyChat.css';

const BuddyChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelStatus, setModelStatus] = useState(null);
  const messagesEndRef = useRef(null);
  const { user } = useUser();

  // GenZ prompt suggestions
  const promptSuggestions = [
    "What's the best late-night food on campus?",
    "How do I join Greek life?",
    "What's happening this weekend?",
    "Where's the best study spot?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check Llama model status on component mount
  useEffect(() => {
    checkModelStatus();
  }, []);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          type: 'bot',
          content: `Hey ${user?.name || 'Lion'}! 🦁 I'm your LMU GenZ Buddy - your go-to for all things campus life! Ask me anything about events, food, study spots, Greek life, or just general LMU vibes. I'm here to help you live your best college life! ✨`,
          timestamp: new Date(),
          model: modelStatus?.available ? 'llama-genz-buddy' : 'fallback'
        }
      ]);
    }
  }, [isOpen, user?.name, modelStatus]);

  const checkModelStatus = async () => {
    try {
      const response = await fetch('/api/llama/status');
      const data = await response.json();
      setModelStatus(data);
      
      if (data.available) {
        console.log('✅ Llama model is available and connected');
      } else {
        console.log('⚠️ Using fallback responses - Llama model not available');
      }
    } catch (error) {
      console.error('Error checking model status:', error);
      setModelStatus({ available: false, status: 'error' });
    }
  };

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
      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        type: msg.type,
        content: msg.content
      }));

      // Make API call to Llama model
      const response = await fetch('/api/genz-buddy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content.trim(),
          conversation_history: conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: data.response,
          timestamp: new Date(),
          model: data.model || 'unknown'
        };

        setMessages(prev => [...prev, botMessage]);
        
        // Show model indicator if using fallback
        if (data.model === 'fallback') {
          console.log('Using fallback response - Llama model unavailable');
        }
      } else {
        throw new Error(data.error || 'Failed to get response');
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "Oops! Something went wrong. 😅 Try asking me something else!",
        timestamp: new Date(),
        model: 'error'
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
        {modelStatus?.available && (
          <span className="model-indicator" title="Llama model connected">✨</span>
        )}
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
                  <p className="chat-subtitle">
                    Your campus bestie ✨
                    {modelStatus?.available ? (
                      <span className="model-status connected"> • Llama Powered</span>
                    ) : (
                      <span className="model-status fallback"> • Fallback Mode</span>
                    )}
                  </p>
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
                    <div className="message-meta">
                      <div className="message-time">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                      {message.model && message.model !== 'llama-genz-buddy' && (
                        <div className="message-model">
                          {message.model === 'fallback' ? '🤖' : '⚠️'}
                        </div>
                      )}
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