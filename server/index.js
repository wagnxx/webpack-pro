const express = require('express');
const app = express();
const server = require('http').createServer(app);
const socket = require('socket.io');

const io = socket(server, {
  cors: {
    origin: '*',
    methods: '*',
    credentials: true
  }
});

const users = {};
const socketToRoom = {};

io.on('connection', (socket) => {
  console.log('user connection id ==> ', socket.id);
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`joined ${roomId} room`)
    if (users[roomId]) {
      const length = users[roomId].length;
      if (length >= 4) {
        socket.emit('room-full');
        return;
      }
      users[roomId].push(socket.id);
    } else {
      users[roomId] = [socket.id];
    }

    socketToRoom[socket.id] = roomId;

    const userInThisRoom = users[roomId].filter((id) => id !== socket.id);
    socket.emit('all-users', userInThisRoom);
  });
  // socket.broadcast.to(roomId).emit('user-connected', userId);
  socket.on('sending-signal', (payload) => {
    io.to(payload.userToSignal).emit('user-joined', {
      signal: payload.signal,
      callerID: payload.callerID
    });
  });

  socket.on('returning-signal', (payload) => {
    io.to(payload.callerID).emit('receiving-returned-signal', {
      signal: payload.signal,
      id: socket.id
    });
  });

  socket.on('disconnect', () => {
    // socket.broadcast.to(roomId).emit('user-desconnented', userId);
    console.log('user will disconnect',socket.id)
    const roomId = socketToRoom[socket.id];
    let room = users[roomId];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomId] = room;
    }
    socket.broadcast.to(roomId).emit('user-disconnect',socket.id)
  });
});

server.listen(3000);
