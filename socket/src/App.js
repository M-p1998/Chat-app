
import {useEffect, useState}  from "react"
import './App.css';
import io from 'socket.io-client';
import Form from "./components/Form";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Homepage from "./components/Homepage";

function App() {

  const [socket] = useState(() =>io(':8000'));
  const [username, setUsername] = useState('')
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on('connect', () =>{
      setIsConnected(true)
    })
    return () => {
      socket.disconnect(true)
    }
  },[])
  return (

    <div className="App">
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Form socket={socket} username={username} setUsername={setUsername} />}/>
            <Route path="/homepage" element={<Homepage socket={socket} username={username} setUsername={setUsername}/>}/>
       
          </Routes>  
      </BrowserRouter>
    </div>
  );
}

export default App;
