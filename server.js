  
const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');

let tasks = [];

const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000)
});
const io = socket(server);

io.on('connection', (socket) => {
  console.log('Hello socket: ',socket.id)
  socket.on('addTask', (task) => {
    tasks = task
    socket.broadcast.emit('updateList', tasks)
  });
});

app.use((req, res) => {
    res.status(404).send({message: 'Not found...'});
});