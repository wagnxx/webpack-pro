
import Peer from 'simple-peer';
let loacalVideo;
let remoteVideo;
let startBtn;
let stopBtn;
let callBtn;
let hangBtn;

let loaclStream;
let pc1;
let pc2;

function init() {
  loacalVideo = document.getElementById('local');
  remoteVideo = document.getElementById('remote');
  startBtn = document.getElementById('start');
  stopBtn = document.getElementById('stop');
  callBtn = document.getElementById('call');
  hangBtn = document.getElementById('hang');

  startBtn.addEventListener('click', start);
  stopBtn.addEventListener('click', stop);
  callBtn.addEventListener('click', callSimple);
  hangBtn.addEventListener('click', hang);
}

async function start(event) {
  if (loaclStream) return;

  event.preventDefault();
  try {
    loaclStream = await navigator.mediaDevices.getUserMedia({ video: true });
    loacalVideo.srcObject = loaclStream;
  } catch (error) {
    console.log('getUsermedia failed');
  }
}

function hang(event) {
  if (pc2 && pc2.connected) {
    pc2 = null;
    remoteVideo.srcObject = null;
  }
}

function stop(event) {
  // pc1.close();
  if (!loaclStream) return;

  loaclStream.getTracks()[0].stop();
  pc1 = null;
}

async function callSimple(event) {
  if (!loaclStream) return;
  pc1 = new Peer({ initiator: true, stream: loaclStream });
  pc2 = new Peer({});

  pc1.on('signal', (data) => pc2.signal(data));
  pc2.on('signal', (data) => pc1.signal(data));

  pc2.on('stream', (stream) => {
    remoteVideo.srcObject = stream;
    if (remoteVideo.paused) remoteVideo.play();
  });
}

export default function app() {
  // window.addEventListener('load', init);
  // // window.addEventListener('load', start);
  init();
}
