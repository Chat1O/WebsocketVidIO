const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');


app.use(cors());

const socketIO = require('socket.io')(http, {
  cors: {
    origin: "localhost:8080"
  },
  headers: 'application/json'
  
});
socketIO.on('connection', (socket) => {
  console.log(`: ${socket.id} user just connected!`);
  socket.on('message', (data) => {
    socketIO.emit('messageResponse', data);
  });
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
app.use('/', express.static(path.join(__dirname, '../build')));


server.listen(3000);