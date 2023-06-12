const Socket = require('websocket').server;
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use('/', express.static(path.join(__dirname, '../build')));


app.listen(3000, () => {
    console.log('Listening on PORT 3000...');
})