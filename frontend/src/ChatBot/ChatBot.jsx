import React, { useState } from 'react';
import axios from 'axios';
import './ChatBot.css'; // Import the CSS file for ChatBot

const ChatBot = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleInputChange = (e) => {
    setUserMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (userMessage.trim() === '') return;

    // Add user message to chat history
    setChatHistory([...chatHistory, { sender: 'user', text: userMessage }]);

    try {
      // Send user message to backend
      const response = await axios.post('http://localhost:5000/api/chatbot/chat', {
        user_message: userMessage
      });

      // Add chatbot response to chat history
      setChatHistory([...chatHistory, { sender: 'user', text: userMessage }, { sender: 'bot', text: response.data.answer }]);
      setUserMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <div className="messages">
          {chatHistory.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              <strong>{message.sender === 'user' ? 'You:' : 'Bot:'}</strong>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
        <div className="chat-form">
          <input
            type="text"
            value={userMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
            required
          />
          <button
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
