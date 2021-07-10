
const { addUerPeer, createSenderPeer } = require('./utils');
const peersList = {};

let senderPeer;
let senderStream;

const users = {};
const socketToRoom = {};

module.exports = io => (socket) => {
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
    senderPeer = createSenderPeer(socket);

    senderPeer.on('stream', (stream) => {
      senderStream = stream;
      console.log('on stream', senderStream.getTracks());
      // senderPeer.emit('data','stream comming')
    });
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
    io.of('/one-many').in(roomId).emit('all-users', users[roomId]);
    io.of('/one-many').in(roomId).emit('member-acount', users[roomId].length);

    if (socket.id === socketToRoom[socket.id]) return;
    // add user
    const peer = addUerPeer(socket);
    peer.addStream(senderStream);
    peer.on('close', () => {
      console.log('user peer closed !');
      // peer.destroy();
      console.log('user peer destroy state : ', peer.destroyed);
      delete peersList[socket.id];
    });

    peersList[socket.id] = peer;
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

    socket.broadcast.to(roomId).emit('user-disconnect', socket.id);
  });
};
