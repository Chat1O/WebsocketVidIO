/* eslint-disable quotes */
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

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

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('message', msg);
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});