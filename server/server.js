const Socket = require('websocket').server;
const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const oaRouter = require('./oaRouter');
const cookieParser = require('cookie-parser')

app.use('/', express.static(path.join(__dirname, '../build')));

//parse requests
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//route all oAuth endpoints to oaRouter
app.use('/login/oa', oaRouter, (req, res) => {
  console.log('routing to Oauth')
});

io.on('connection', (socket) => {
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
  console.log('listening on PORT:3000');
});