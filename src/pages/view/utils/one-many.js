import Peer from 'simple-peer';
import io from 'socket.io-client';

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

function init() {
  console.log('========= one many =========');
  computeDom();
  createSocket();
}

function createSocket() {
  localSocket = io.connect('//192.168.1.103:3000');

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
}

function createRoom(e) {
  e.preventDefault();
  localSocket.emit('create-room');
}

async function openHandle(e) {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true });
  videoElement.srcObject = localStream;
  videoElement.autoplay = true;
  videoElement.height = 300;

  localPeer = new Peer({ initiator: true,trickle:false, stream: localStream });
  window.localPeer = localPeer;

  localPeer.on('signal', (data) => {
    localSocket.emit('initiatorPeer-created', data);
  });
  localPeer.on('data',dat => console.log(dat))
  // localSocket.emit('initiatorPeer-created')

  // USERs
  // call
}

function stopHandle(e) {}

export default function app() {
  init();
}
