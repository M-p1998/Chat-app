

import React, { useState, useEffect } from 'react';

const Homepage = (props) => {
  const { socket, username } = props;
  const [users, setUsers] = useState([]);
  const [input, setInput] = useState('');
  const [userMessages, setUserMessages] = useState({});
  const [chatFullMessage, setChatFullMessage] = useState('');

  useEffect(() => {
    socket.on(`new-user-joined`, (data) => {
      console.log(data);
      setUsers(data);
    });
    socket.on('send-message-to-all-clients', (data) => {
      setUserMessages((prevUserMessages) => {
        const userId = data.userId;
        const updatedMessages = [...(prevUserMessages[userId] || []), data];
        return { ...prevUserMessages, [userId]: updatedMessages };
      });
    });
    socket.on('chat-full', (message) => {
      setChatFullMessage(message);
    });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit('send-message', { message: input, username: username });
    setInput('');
    // Update userMessages state with the new message
    setUserMessages((prevUserMessages) => {
      const updatedMessages = [...(prevUserMessages[socket.id] || []), { message: input, username: username }];
      return { ...prevUserMessages, [socket.id]: updatedMessages };
    });
  };

  
  return (
    <div>
      <h2>Users in the chat</h2>
      {users.map((user) => (
        <p key={user.id}>username: {user.username}</p>
      ))}
      {/* {chatFullMessage && <p>{chatFullMessage}</p>} */}
      {/* {users.length === 2 && !chatFullMessage && (
        <div>
          <h3>Conversation between {users[0].username} and {users[1].username}</h3>
          <div className="conversation">
            {(userMessages[users[0].id] || userMessages[users[1].id]) && (
              <>
                {userMessages[users[0].id]?.map((message, index) => (
                  <div
                    className={`message ${message.username === username ? 'self' : 'other'}`}
                    key={index}
                  >
                    {message.username} says: {message.message}
                  </div>
                ))}
                {userMessages[users[1].id]?.map((message, index) => (
                  <div
                    className={`message ${message.username === username ? 'self' : 'other'}`}
                    key={index}
                  >
                    {message.username} says: {message.message}
                  </div>
                ))}
              </>
            )}
          </div>
          <form onSubmit={sendMessage}>
            <label>Message</label>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
            <button>Send Message</button>
          </form>
        </div>
      )} */}
      {users.length === 2 && !chatFullMessage && (
  <div>
    <h3>Conversation between {users[0].username} and {users[1].username}</h3>
    <div className="conversation">
      {users.map(user => (
        userMessages[user.id]?.map((message, index) => (
          <div
            className={`message ${message.username === username ? 'self' : 'other'}`}
            key={index}
          >
            {message.username} says: {message.message}
            
          </div>
        ))
      ))}
    </div>
    <form onSubmit={sendMessage}>
      <label>Message</label>
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      <button>Send Message</button>
    </form>
  </div>
)}
    </div>
  );
};

export default Homepage;


