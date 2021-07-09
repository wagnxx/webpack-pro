const fs = require('fs');
const path = require('path');
const express = require('express');
const { addUerPeer, createSenderPeer } = require('./utils');

const peersList = {};

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, '/../cert', 'private.key')),
  cert: fs.readFileSync(path.join(__dirname, '/../cert', 'mydomain.crt'))
};
let senderPeer;
let senderStream;

const app = express();
const server = require('https').createServer(httpsOptions, app);
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
  socket.send(socket.id);

  socket.emit('room-list', Object.keys(users));
  socket.emit('room-created', Object.keys(users).length);


  socket.on('create-room', () => {
    if (users[socket.id]) {
      socket.emit('room-exist', `${socket.id} romm is exist`);
      return;
    }
    users[socket.id] = [];
    socketToRoom[socket.id] = socket.id;
    socket.emit('create-room-success', socket.id);
    io.emit('room-list', Object.keys(users));
    // create peer
    createSenderPeer(socket);
  });

  socket.on('join-room', ({ roomId }) => {
    socket.join(roomId);
    console.log(`joined ${roomId} room`);
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
    io.in(roomId).emit('member-acount', users[roomId].length);

    if (socket.id === socketToRoom[socket.id]) return;
    // add user
    addUerPeer(socket);
  });

  socket.on('initiatorPeer-created', (data) => {
    if (socket.id !== socketToRoom[socket.id]) return;

    senderPeer.signal(data);
  });

  socket.on('user-send-signal', (signal) => {
    const peer = peersList[socket.id];

    peer.signal(signal);
  });

  socket.on('disconnect', () => {
    const roomId = socketToRoom[socket.id];
    let room = users[roomId];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomId] = room;

      const length = room.length;
      socket.broadcast.to(roomId).emit('member-acount', length);
    }
    console.log('================ disconnect ==============================');
    console.log('roomId === socket.id ? ', roomId === socket.id);
    console.log('roomid : ', roomId);
    console.log('socket id : ', socket.id);

    if (roomId === socket.id) {
      delete users[roomId];
    }
    // let peer = peersList[socket.id];

    // peer && peer.destroyed === false && peer.destroy();

    socket.broadcast.to(roomId).emit('user-disconnect', socket.id);
  });
});

server.listen(3000);
