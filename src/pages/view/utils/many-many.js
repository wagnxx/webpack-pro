import Peer from 'simple-peer';
import io from 'socket.io-client';

const videoBox = document.getElementById('many-many');
let loacalVideo = document.getElementById('local-many');
let memberAccountElement = document.getElementById('member-acount');
let localStreame;
let localSocket;
let peerList = {};

const roomID = 1;

function init() {
  const startBtn = document.getElementById('start-btn');
  const stopBtn = document.getElementById('stop-btn');
  startBtn.onclick = startOpen;
  stopBtn.onclick = stop;
}

function stop(e) {
  localStreame.getTracks()[0].stop();
  localSocket.close();

  memberAccountElement.innerText = '';
  document.getElementById('yourID').innerText = '';
}

async function startOpen(e) {
  try {
    localStreame = await navigator.mediaDevices.getUserMedia({ video: true });
    loacalVideo.srcObject = localStreame;

    localSocket.emit('join-room', roomID);
  } catch (error) {
    console.log('open camr failed !', error);
  }
}

function socketEvents(socket) {
  socket.on(
    'message',
    () => (document.getElementById('yourID').innerText = socket.id)
  );

  socket.on('all-users', (users) => {
    if (users.length <= 0) return;
    users.forEach((userID) => {
      const peer = createPeer(userID, socket.id, localStreame);
      peerList[userID] = peer;
      addVideoToBox(peer, userID);
    });
  });

  socket.on('user-joined', ({ signal, callerID }) => {
    const peer = addPeer(signal, callerID, localStreame);
    peerList[callerID] = peer;
    addVideoToBox(peer, callerID);
  });

  socket.on('receiving-returned-signal', (payload) => {
    peerList[payload.id].signal(payload.signal);
  });
  socket.on('member-acount', (n) => {
    memberAccountElement.innerText = n;
  });
  socket.on('user-disconnect', removeVideById);
}

function addPeer(incommingSignal, callerID, stream) {
  const peer = new Peer({
    initiator: false,
    trickle: false,
    stream
  });
  peer.on('signal', (signal) => {
    localSocket.emit('returning-signal', { signal, callerID });
  });
  peer.signal(incommingSignal);
  peer.on('close', () => peer.removeAllListeners('close'));
  return peer;
}
function createPeer(userToSignal, callerID, stream) {
  const peer = new Peer({
    initiator: true,
    trickle: false,
    stream
  });
  peer.on('signal', (signal) => {
    localSocket.emit('sending-signal', { userToSignal, callerID, signal });
  });

  peer.on('close', () => peer.removeAllListeners('close'));

  // addVideoToBox(peer);

  return peer;
}
function removeVideById(id) {
  let elm = document.getElementById(id);
  elm.remove();
  let peer = peerList[id];
  if (peer) {
    console.log('should destroyed',peer)
    peer.removeStream(localStreame)
  }
}
function addVideoToBox(peer, id) {
  const divElement = document.createElement('div');
  const videoElement = document.createElement('video');
  divElement.class = 'video-initiator col col-3';
  divElement.id = id;

  videoElement.mute = true;
  videoElement.width = 220;
  videoElement.height = 120;
  videoElement.autoplay = true;

  divElement.appendChild(videoElement);
  videoBox.appendChild(divElement);

  peer.on('stream', (stream) => {
    videoElement.srcObject = stream;
    // videoElement.addEventListener('loadedmetadata', () => {
    //   videoElement.play();
    // });
  });
}

function start() {
  document.getElementById('connect').onclick = function () {
    localSocket = io.connect('//192.168.1.103:3000');
    socketEvents(localSocket);
  };
  init();
}



export default function app() {
  // window.addEventListener('load', start);
  start()
}