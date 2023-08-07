

const express = require('express');
const app = express();
const cors = require('cors');
const socket = require('socket.io');
const port = 8000;
app.use(cors());
 
const server = app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
});
 
// to initialize the socket, we need to invoke a new instance
//     of socket.io and pass it our express server instance
// We must also include a configuration settings object to prevent CORS errors
const io = socket(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        allowedHeaders: ['*'],
        credentials: true,
    }
});

let users = []
io.on("connection", socket => {
    // NOTE: Each client that connects get their own socket id!
    // if this is logged in our node terminal, that means we a new client
    //     has successfully completed the handshake!
    console.log('socket id: ' + socket.id);
    socket.on(`join-server`, username => {
        console.log(username);
        let newUser = {id:socket.id, username: username }
        users.push(newUser)
        io.emit('new-user-joined', users)

    })
    socket.on('send-message', data =>{
        console.log(data)
        io.emit('send-message-to-all-clients', data)
    })
    
    // We add our additional event listeners right inside this function
    // NOTE: "connection" is a BUILT IN events listener
});