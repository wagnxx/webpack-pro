import io from 'socket.io-client';
// const Peer = require('simple-peer')
import CONST from '../../../config/const'

let createRoomBtn;
let stopBtn;
let openBtn;

let callBtn;
let hangBtn;

let videoElement;

let yourIDElement;
let roomIDElement;
let memberAcountElement;

let localStream;
let localSocket;
let roomID;
let localPeer;
let userPeer;

function init() {
  console.log('========= one many =========');
  computeDom();
  createSocket();
}

function createSocket() {
  localSocket = io.connect(`${CONST.SOCKET_ORIGIN}/one-many`);

  localSocket.on('room-list', (rooms) => {
    console.log('room-list', rooms);
    roomIDElement.innerText = rooms[0] || '-';
    if (rooms.length) {
      roomID = rooms[0];
      setBtnDisabled(roomID === localSocket.id, true);
    } else {
      setBtnDisabled(true, false);
    }
  });

  localSocket.on('create-room-success', (id) => {
    // alert(`${id} room create success`);
    roomIDElement.innerText = id;
    setBtnDisabled(true, true);
  });
  localSocket.on('room-exist', (msg) => {
    alert(msg);
  });
  localSocket.on('member-acount', (n) => {
    memberAcountElement.innerText = n || '-';
  });
  localSocket.on('message', (n) => {
    yourIDElement.innerText = n;
  });
  // peer interactive
  // localSocket.on('user-joined', () =>{
  //   const initiatorPeer = new Peer({
  //     initiator: true,
  //     stream: localStream
  //   });

  //   initiatorPeer.on('signal', signal => {
  //     localSocket.emit('sending-signal',{signal,userToSignal,callerID})
  //   })
  // })
  localSocket.on('answer-initiator', (data) => {
    console.log('answer', data);
    localPeer.signal(data);
  });
  localSocket.on('return-user-signal', (data) => {
    console.log('return-user-signal', data);
    userPeer.signal(data);
  });


}
function setBtnDisabled(isRomote, createRoomSuccess) {
  if (isRomote) {
    document.getElementById('remote-end').classList.remove('hide');
    document.getElementById('client-end').classList.add('hide');
    createRoomBtn.disabled = createRoomSuccess;
  } else {
    document.getElementById('remote-end').classList.add('hide');
    document.getElementById('client-end').classList.remove('hide');
  }
}

function computeDom() {
  callBtn = document.getElementById('call-btn-one-many');
  hangBtn = document.getElementById('hang-btn-one-many');
  createRoomBtn = document.getElementById('create-room');
  openBtn = document.getElementById('start-btn-one-many');
  stopBtn = document.getElementById('stop-btn-one-many');
  videoElement = document.getElementById('video-one-many');
  roomIDElement = document.getElementById('roomID');
  yourIDElement = document.getElementById('yourID');
  memberAcountElement = document.getElementById('member-acount');

  createRoomBtn.addEventListener('click', createRoom);
  openBtn.addEventListener('click', openHandle);
  stopBtn.addEventListener('click', stopHandle);

  callBtn.addEventListener('click', callHandle);
  hangBtn.addEventListener('click', hangHandle);
}

function hangHandle(e) { 
  e.preventDefault();
  // localSocket.close();
  // userPeer.destroy();
  userPeer.send('close');
  userPeer.destroy();
  userPeer.removeAllListeners('close');
}

function callHandle(e) {
  e.preventDefault();
  console.log('call btn clicked !')
  userPeer = new Peer({initiator:true, trickle: false});
  localSocket.emit('join-room',{roomId:roomID})

  userPeer.on('signal', signal => {
    localSocket.emit('user-send-signal',signal)
  })

  userPeer.on('close', () => {
    console.log('user closed')
  })

  userPeer.on('error', err => {
    console.log('user peer error', err);
  })
  
  userPeer.on('stream', stream => {
    console.log('user stream is received : ', stream);
    videoElement.srcObject = stream;
    videoElement.autoplay = true;
  })

  window.userPeer = userPeer;
}

function createRoom(e) {
  e.preventDefault();
  localSocket.emit('create-room');
}

async function openHandle(e) {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true });
  videoElement.srcObject = localStream;
  videoElement.autoplay = true;
  // videoElement.height = 300;

  localPeer = new Peer({
    initiator: true,
    stream: localStream,
    trickle: false
  });
  window.localPeer = localPeer;

  localPeer.on('signal', (data) => {
    localSocket.emit('initiatorPeer-created', data);
  });
  // localSocket.emit('initiatorPeer-created')
  localPeer.on('connect', () => {
    console.log('server senderPeer is Connected');
    console.log('peer connected state:', localPeer.connected);
    // localPeer.send('data of peeer connected');
    // localPeer.send('connected !!')
  });

  localPeer.on('close', () => {
    console.log('senderPeer is closed!');
    localPeer.destroy();
  });

  localPeer.on('data', () => {
    console.log('senderPeer is data!');
  });

  localPeer.on('error', (err) => {
    console.log('localPeer Received ERRor　：　', err);
  });

  // localPeer.addStream(localStream);
  // localStream.getTracks().forEach(track => localPeer.addTrack(track, localStream));

  // USERs
  // call
}

function stopHandle(e) {
  // localPeer.removeStream(localStream);
  localPeer.send('close');
  localPeer.destroy();
  localPeer.removeAllListeners('close');
  localStream.getTracks()[0].stop();
}

export default function app() {
  init();
}
