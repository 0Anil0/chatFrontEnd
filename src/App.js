import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './styles.css';

// Initialize socket connection
const socket = io('http://localhost:5000');

function App() {
  const [messages, setMessages] = useState([]);
  const [user1Message, setUser1Message] = useState('');
  const [user2Message, setUser2Message] = useState('');

  useEffect(() => {
    // Fetch previous messages
    axios.get('http://localhost:5000/messages')
      .then((response) => setMessages(response.data))
      .catch((error) => console.error('Error fetching messages:', error));

    // Listen for new messages
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => socket.off('receiveMessage');
  }, []);

  const sendMessage = (sender, message, setMessage) => {
    if (message.trim()) {
      socket.emit('sendMessage', { sender, message });
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <h1>Two-User Chat App</h1>
      <div className="user-chat">
        {/* User 1 Chat */}
        <div className="chat-box user1">
          <h2>User 1</h2>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              msg.sender === 'User1' && (
                <div key={index} className="chat-message user1-message">
                  <strong>{msg.sender}:</strong> {msg.message}
                </div>
              )
            ))}
          </div>
          <input
            type="text"
            placeholder="User 1: Type a message..."
            value={user1Message}
            onChange={(e) => setUser1Message(e.target.value)}
          />
          <button onClick={() => sendMessage('User1', user1Message, setUser1Message)}>Send</button>
        </div>

        {/* User 2 Chat */}
        <div className="chat-box user2">
          <h2>User 2</h2>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              msg.sender === 'User2' && (
                <div key={index} className="chat-message user2-message">
                  <strong>{msg.sender}:</strong> {msg.message}
                </div>
              )
            ))}
          </div>
          <input
            type="text"
            placeholder="User 2: Type a message..."
            value={user2Message}
            onChange={(e) => setUser2Message(e.target.value)}
          />
          <button onClick={() => sendMessage('User2', user2Message, setUser2Message)}>Send</button>
        </div>
      </div>

      {/* Shared Chat View */}
      <div className="chat-box shared">
        <h2>Shared Chat</h2>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender === 'User1' ? 'user1-message' : 'user2-message'}`}>
              <strong>{msg.sender}:</strong> {msg.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
