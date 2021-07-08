const fs = require('fs');
const path = require('path');
const express = require('express');
const wrtc = require('wrtc');
const Peer = require('simple-peer');
const app = express();

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, '/../cert', 'private.key')),
  cert: fs.readFileSync(path.join(__dirname, '/../cert', 'mydomain.crt'))
};
let senderPeer;
let senderStream;

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
  console.log('user connection id ==> ', socket.id);

  socket.send(socket.id);

  socket.emit('room-list', Object.keys(users));

  socket.on('create-room', () => {
    if (users[socket.id]) {
      socket.emit('room-exist', `${socket.id} romm is exist`);
      return;
    }
    users[socket.id] = [];
    socketToRoom[socket.id] = socket.id;
    socket.emit('create-room-success', socket.id);
    // create peer
    senderPeer = new Peer({ initiator: false,trickle:false, wrtc: wrtc });
  });

  socket.on('join-room', (roomId) => {
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
    socket.emit('member-acount', users[roomId].length);
    socket.broadcast.to(roomId).emit('member-acount', users[roomId].length);
  });
  socket.on('initiatorPeer-created', (data) => {
    if (socket.id !== socketToRoom[socket.id]) return;

    senderPeer.signal(data);
    senderPeer.on('signal', (signal) => {
      socket.emit('answer-initiator', signal);
      // console.log('signal from local initiator :',signal)
    });

    senderPeer.on('data', dat => {
      console.log(dat)
      console.log('senderPeer.connected',senderPeer.connected)
    })
    
    senderPeer.on('stream', (stream) => {
      senderStream = stream;
      console.log('on stream',senderStream.getTracks())
      // senderPeer.emit('data','stream comming')
    });
  });
  // socket.broadcast.to(roomId).emit('user-connected', userId);
  socket.on('sending-signal', (payload) => {
    if (socket.id === socketToRoom[socket.id]) {
    } else {
      io.to(payload.userToSignal).emit('user-joined', {
        signal: payload.signal,
        callerID: payload.callerID
      });
    }
  });

  socket.on('returning-signal', (payload) => {
    io.to(payload.callerID).emit('receiving-returned-signal', {
      signal: payload.signal,
      id: socket.id
    });
  });

  socket.on('disconnect', () => {
    // socket.broadcast.to(roomId).emit('user-desconnented', userId);
    console.log('user will disconnect', socket.id);
    const roomId = socketToRoom[socket.id];
    let room = users[roomId];
    console.log('rooms before deleted : ', users);
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomId] = room;

      const length = room.length;
      socket.broadcast.to(roomId).emit('member-acount', length);
    }
    console.log('roomId === socket.id ? ', roomId === socket.id);
    console.log('roomid : ', roomId);
    console.log('socket id : ', socket.id);
    if (roomId === socket.id) {
      delete users[roomId];
    }
    console.log('rooms after deleted : ', users);
    socket.broadcast.to(roomId).emit('user-disconnect', socket.id);
  });
});

server.listen(3000);
