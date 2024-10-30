const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

let rooms = {};
let players = {};

io.on('connection', (socket) => {
  console.log('Un jugador se ha conectado');

  socket.on('joinRoom', (roomId) => {
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    rooms[roomId].push(socket.id);
    socket.join(roomId);
  });

  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
  });

  socket.on('makeMove', (roomId, move) => {
    io.to(roomId).emit('updateBoard', move);
  });

  socket.on('disconnect', () => {
    console.log('Un jugador se ha desconectado');
  });
});

server.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});