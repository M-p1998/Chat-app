
// import React from 'react';
// import {useState, useEffect} from "react";

// const Homepage = (props) => {
//     const {socket,  username, setUsername} = props
//     const [users, setUsers] = useState([])
//     const [input, setInput] = useState('')
//     // const [messages, setMessages] = useState({})

//     const [userMessages, setUserMessages] = useState({});

//     useEffect(() =>{

//         socket.on(`new-user-joined`, data => {
//             console.log(data);
//             setUsers(data)
//         });
//         socket.on('send-message-to-all-clients', (data) =>{
//             // setMessages([...messages, data])
//             setUserMessages((prevUserMessages) => {
//                 const userId = data.userId;
//                 const updatedMessages = [...(prevUserMessages[userId] || []), data];
//                 return { ...prevUserMessages, [userId]: updatedMessages };
//               });
//         })
//     }, [])

//     const sendMessage = (e) =>{
//         e.preventDefault();
//         socket.emit('send-message', {message: input, username: username})
//     }

//     return (
//         <div>
//           <h2>Users in the chat</h2>
//           {users.map((user) => (
//             <p key={user.id}>username: {user.username}</p>
//           ))}
//           <form onSubmit={sendMessage}>
//             <label>Message</label>
//             <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
//             <button>Send Message</button>
//           </form>
//           {users.map((user) => (
//             <div key={user.id}>
//               <h3>Conversation with {user.username}</h3>
//               {userMessages[user.id] &&
//                 userMessages[user.id].map((message, index) => (
//                   <div key={index}>
//                     {message.username} Says: {message.message}
//                   </div>
//                 ))}
//             </div>
//           ))}
//         </div>
//       );

// //   return (
// //     <div>
// //         <h2>Users in the chat</h2>
// //         {
// //             users.map((user) => (
// //                 <p key={user.id}>username: {user.username}</p>
// //             ))
// //         }
// //         <form onSubmit={sendMessage}>
// //             <label>Message</label>
// //             <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
// //             <button>Send Message</button>
// //         </form>
// //         {
// //             messages.map((message, index) =>(
// //                 <div key={index} >{message.username} Says: {message.message} </div>
// //             ))
// //         }
// //     </div>
// //   )
// }

// export default Homepage



import React, { useState, useEffect } from 'react';

const Homepage = (props) => {
  const { socket, username, setUsername } = props;
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
  };


  // return (
  //   <div>
  //     <h2>Users in the chat</h2>
  //     {users.map((user) => (
  //       <p key={user.id}>username: {user.username}</p>
  //     ))}
  //     {chatFullMessage && <p>{chatFullMessage}</p>}
  //     {users.length === 2 && !chatFullMessage && (
  //       <form onSubmit={sendMessage}>
  //         <label>Message</label>
  //         <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
  //         <button>Send Message</button>
  //       </form>
  //     )}
  //     {users.map((user) => (
  //       <div key={user.id}>
  //         <h3>Conversation with {user.username}</h3>
  //         {userMessages[user.id] &&
  //           userMessages[user.id].map((message, index) => (
  //             <div key={index}>
  //               {message.username} Says: {message.message}
  //             </div>
  //           ))}
  //       </div>
  //     ))}


  //   </div>
  // );

  

  return (
    <div>
      <h2>Users in the chat</h2>
      {users.map((user) => (
        <p key={user.id}>username: {user.username}</p>
      ))}
      {chatFullMessage && <p>{chatFullMessage}</p>}
      {/* {users.length === 2 && !chatFullMessage && ( */}
        <form onSubmit={sendMessage}>
          <label>Message</label>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
          <button>Send Message</button>
        </form>
      {/* )} */}
      {users.length === 2 && !chatFullMessage && (
        <div>
          <h3>Conversation between {users[0].username} and {users[1].username}</h3>
          <div className="conversation">
            {userMessages[users[0].id] && userMessages[users[1].id] && (
              userMessages[users[0].id].map((message, index) => (
                <div  className={`message ${message.userId === users[0].id ? 'self' : 'other'}`} key={index}>
                  {message.username} says: {message.message}
                </div>
              )).concat(
                userMessages[users[1].id]&&
                userMessages[users[0].id] &&
                userMessages[users[1].id].map((message, index) => (
                  <div className={`message ${message.userId === users[1].id ? 'self' : 'other'}`} key={index}>
                    {message.username} says: {message.message}
                  </div>
                ))
              )
            )}
          </div>
          </div>
      )}
    </div>
  );




};

export default Homepage;