const express = require('express');
const { getEventListeners } = require('node:events');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// io.on('connection', (socket) => {
//   console.log('a user connected');
// });

// Emitting events

var users={};

io.on("connection" , (socket) =>{
    socket.on("new-user-joined",(username)=>{
        users[socket.id]=username;
        socket.broadcast.emit('user-connected' , username);
        io.emit("user-list" , users);
    });

    socket.on("disconnect" , ()=>{
      socket.broadcast.emit('user-disconnected' , user=users[socket.id]);
      delete users[socket.id];
      io.emit("user-list" , users);
    });

    socket.on('message',(data)=>{
      socket.broadcast.emit("message", {user: data.user , msg: data.msg});
    });
});


server.listen(300, () => {
  console.log('server running at http://localhost:300');
});