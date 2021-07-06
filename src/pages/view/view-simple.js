import 'bootstrap/dist/css/bootstrap.min.css';
import Peer from 'simple-peer';
import startOneMany from './utils/many-many'
import menus from '../../config/menus';
import './css/header.css';
setMenus(menus);

startOneMany();

document.getElementById('inputGroupSelect01').addEventListener('change', function(e) {
  console.log(this.value)
  const types = ['one-one', 'one-many'];
  let selectedId = types.find(typ => typ === this.value);
  let unselecteds = types.filter(typ => typ !== this.value);
  unselecteds.forEach(id => {
    document.getElementById(id).classList.add('hide')
  })
  document.getElementById(selectedId).classList.remove('hide')
})


let loacalVideo = document.getElementById('local');
let remoteVideo = document.getElementById('remote');

let startBtn = document.getElementById('start');
let stopBtn = document.getElementById('stop');
let callBtn = document.getElementById('call');
let hangBtn = document.getElementById('hang');

startBtn.addEventListener('click', start);
stopBtn.addEventListener('click', stop);
callBtn.addEventListener('click', callSimple);
hangBtn.addEventListener('click', hang);

let loaclStream;
let pc1;
let pc2;

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



function setMenus(menus) {
  let _html = menus
    .map((item) => {
      return `<li key=${item.key}><a href=${item.link}>${item.text}</a></li>`;
    })
    .join('');

  document.querySelector('header ul') .innerHTML = _html
}
