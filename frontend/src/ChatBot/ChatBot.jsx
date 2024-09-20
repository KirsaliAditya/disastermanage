import React, { useState } from 'react';
import axios from 'axios';
import './ChatBot.css'; // Import the CSS file for ChatBot

const ChatBot = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isFirstMessage, setIsFirstMessage] = useState(true); // Flag to check if it's the first message

  const handleInputChange = (e) => {
    setUserMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (userMessage.trim() === '') return;

    // Predefined message to send on the first user prompt
    const predefinedMessage = "India has experienced several significant flood events in recent years, primarily due to heavy rainfall during the monsoon season. Here are some of the most notable ones: 2023 North India Floods, 2023 Chennai Floods, 2023 Thoothukkudi-Tirunelveli Floods, 2024 Wayanad Floods, and 2024 Andhra Pradesh and Telangana Floods.";

    // Add user message to chat history first
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { sender: 'user', text: userMessage }
    ]);

    try {
      let chatbotResponse = '';

      if (isFirstMessage) {
        // Send predefined message on the first interaction
        chatbotResponse = predefinedMessage;
        setIsFirstMessage(false); // Set flag to false after sending the first message
      } else {
        // Send user message to backend if not the first message
        const response = await axios.post('http://localhost:5000/api/chatbot/chat', {
          user_message: userMessage
        });
        chatbotResponse = response.data.answer;
      }

      // Add chatbot response to chat history after user's message
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: 'bot', text: chatbotResponse }
      ]);

      // Clear user input
      setUserMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
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
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            required
          />
          <button onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
