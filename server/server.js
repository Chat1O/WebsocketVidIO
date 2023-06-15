/* eslint-disable quotes */
/* eslint-disable quotes */
const Socket = require('websocket').server;
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
// const { ExpressPeerServer } = require('peer');

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

//parse requests
app.use(express.urlencoded({extended: true}));
app.use(express.json());

let activeSockets = [];

io.on('connection', (socket) => {
  console.log('a user connected');


  // check if socket exists
  const existingSocket = activeSockets.find(
    existingSocket => existingSocket === socket.id
  );

  // if it doesn't exist, push it to memory and emit data to connected users
  if (!existingSocket) {
    activeSockets.push(socket.id);
    
    socket.emit('update-user-list', {
      users: activeSockets.filter(
        existingSocket => existingSocket !== socket.id
      )
    });
    

    socket.broadcast.emit('update-user-list', {
      users: [socket.id]
    })
  }

  // if user disconnects, remove from list
  socket.on('disconnect', () => {
    console.log('user disconnected');
    activeSockets = activeSockets.filter(
      existingSocket => existingSocket !== socket.id
    );
    socket.broadcast.emit('remove-user', {
      socketId: socket.id
    })
  })
  socket.on('send-message', data => {
    io.emit('get-message', {
      socket: socket.id,
      message: data.message
    })
  })
  console.log('a user connected');
});

//error handling
app.use('*', (req, res) => {
  res.sendStatus(404)
});

app.use((err, req, res, next) => {
  const defaultError = {
    Log: 'Unknown error in middleware',
    Message: 'Error occured.',
    Status: 400
  }
  const error = Object.assign(defaultError, err);
  return res.status(error.status).json(error.Message)
})

server.listen(3000, () => {
  console.log('listening on *:3000');
});