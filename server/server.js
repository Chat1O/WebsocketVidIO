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

let sockets = [];

io.on('connection', (socket) => {
  console.log('a user connected');
  sockets.push(socket);

  socket.on('disconnect', () => {
    console.log('user disconnected');
    sockets = sockets.filter(s => s !== socket);
  })

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('message', msg);
  })

  socket.on('signal', (data) => {
    console.log('signal received');
    sockets.filters(s => s !== socket).forEach(s => s.emit('signal', data));
  })

  socket.on('ice', (data) => {
    console.log('ice candidate received');
    sockets.filter(s => s !== socket).forEach(s => s.emit('ice', data));
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});