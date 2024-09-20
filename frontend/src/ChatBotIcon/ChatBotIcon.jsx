import React, { useState } from 'react';
import './ChatBotIcon.css'; // Import the CSS file
import ChatBot from '../ChatBot/ChatBot'; // Import the ChatBot component

const ChatBotIcon = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatWidget = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="floating-chat-icon" onClick={toggleChatWidget}>
        <i className="fas fa-comments"></i>
        <span className="chat-text">How may I help you?</span>
      </div>
      <div className={`chat-widget ${isOpen ? 'open' : ''}`}>
        <div className="chat-widget-header">
          ChatBot
          <button className="close-btn" onClick={() => setIsOpen(false)}>X</button>
        </div>
        <div className="chat-widget-body">
          <ChatBot />
        </div>
      </div>
    </>
  );
};

export default ChatBotIcon;
