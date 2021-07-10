const wrtc = require('wrtc');
const Peer = require('simple-peer');

function addUerPeer(socket) {
  const peer = new Peer({
    initiator: false,
    trickle: false,
    objectMode: true,
    wrtc: wrtc
  });

  peer.on('data', (dat) => {
    console.log(dat);
    console.log('user peer dis.connected', peer.connected);
    if (dat === 'close') {
      peer.destroy();
    }
  });

  peer.on('error', (err) => {
    console.log('user peer err: ', err.code);
  });

  peer.on('signal', (signal) => {
    socket.emit('return-user-signal', signal);
  });

  return peer;
}

function createSenderPeer(socket) {
  const senderPeer = new Peer({
    initiator: false,
    trickle: false,
    objectMode: true,
    wrtc: wrtc
  });
  senderPeer.on('signal', (signal) => {
    socket.emit('answer-initiator', signal);
    // console.log('signal from local initiator :',signal)
  });

  senderPeer.on('data', (dat) => {
    console.log(dat);
    console.log('senderPeer.connected', senderPeer.connected);
    if (dat === 'close') {
      senderPeer.destroy();
    }
  });

  senderPeer.on('connect', () => {
    // senderPeer.send('connected !!')
    console.log('senderPeer.connected', senderPeer.connected);
    console.log('connected initiator Local Peer !');
  });

  senderPeer.on('close', () => {
    console.log('senderPeer is closed!');
    // senderPeer.destroy();
    console.log('senderPeer destroyed state :',senderPeer.destroyed)
  });
  senderPeer.on('error', (err) => {
    console.log('sender err: ', err);
  });



  return senderPeer;
}

module.exports = {
  addUerPeer,
  createSenderPeer
};
