
import {useEffect, useState}  from "react"
import './App.css';
import io from 'socket.io-client';
import Form from "./components/Form";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Homepage from "./components/Homepage";

function App() {

  const [socket] = useState(() =>io(':8000'));
  const [username, setUsername] = useState('')
  // const [isConnected, setIsConnected] = useState(socket.connected);
  const [users, setUsers] = useState([]);
  const [userMessages, setUserMessages] = useState({});
  const [chatFullMessage, setChatFullMessage] = useState('');

  // useEffect(() => {
  //   socket.on('connect', () =>{
  //     setIsConnected(true)
  //   })
  //   return () => {
  //     socket.disconnect(true)
  //   }
  // },[])


  useEffect(() => {
    socket.on(`new-user-joined`, (data) => {
      console.log('new-user-joined:', data);
      setUsers(data);
    });
    socket.on('send-message-to-all-clients', (data) => {
      console.log('send-message-to-all-clients:', data);
      setUserMessages((prevUserMessages) => {
        const userId = data.userId;
        const updatedMessages = [...(prevUserMessages[userId] || []), data];
        return { ...prevUserMessages, [userId]: updatedMessages };
      });
    });
    socket.on('chat-full', (message) => {
      console.log('chat-full:', message);
      setChatFullMessage(message);
    });
  }, []);  

  return (

    <div className="App">
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Form socket={socket} username={username} setUsername={setUsername} />}/>
            <Route path="/homepage" element={<Homepage socket={socket} username={username} setUsername={setUsername}  />} />
       
          </Routes>  
      </BrowserRouter>
    </div>
  );
}

export default App;
