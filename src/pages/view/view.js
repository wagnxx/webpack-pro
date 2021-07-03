import 'bootstrap/dist/css/bootstrap.min.css';
import * as utils from './utils'

let loacalVideo = document.getElementById('local');
let remoteVideo = document.getElementById('remote');

let startBtn = document.getElementById('start');
let callBtn = document.getElementById('call');
let hangBtn = document.getElementById('hang');

startBtn.addEventListener('click', start)
callBtn.addEventListener('click', call);
hangBtn.addEventListener('click', hang);



let loaclStream;
let pc1;
let pc2;



async function start(event) {
  event.preventDefault();
  try {
    loaclStream = await navigator.mediaDevices.getUserMedia({ video: true });
    loacalVideo.srcObject = loaclStream;
  } catch (error) {
    console.log('getUsermedia failed');
  }
}

async function call(event) {
  let configur = {};

  pc1 = new RTCPeerConnection(configur);
  pc2 = new RTCPeerConnection(configur);

  pc1.onicecandidate = (e) => onicecandidate(e, pc1);
  pc2.onicecandidate = (e) => onicecandidate(e, pc2);

  loaclStream.getTracks().forEach((track) => pc1.addTrack(track, loaclStream));
  pc2.ontrack = getRemoveTrack;

  try {
    const offer = await  pc1.createOffer()
    await createOfferSuccess(offer);
  } catch (error) {
    utils.createOfferError('pc1',error)
  }
}


function hang(event) {
  pc2.close();
  pc2 = null;
}


async function createOfferSuccess(desc) {
  try {
    await pc1.setLocalDescription(desc)
    utils.createOfferSuccessResponse('pc1')
  } catch (error) {
    utils.createOfferError('pc1',error)
  }

  try {
    await pc2.setRemoteDescription(desc);
  } catch (error) {
    utils.createOfferError('pc2',error)
  }

  try {
    const answer = await pc2.createAnswer();
    await createAnswerSuccess(answer)
  } catch (error) {
    utils.createOfferError('pc2', error);
  }
}

async function createAnswerSuccess(desc) {
  try {
    await pc2.setLocalDescription(desc)
    utils.createOfferSuccessResponse('pc2')
    
  } catch (error) {
    utils.createOfferError('pc2', error);
  }

  try {
    await pc1.setRemoteDescription(desc);
    utils.setRemoteSDPSuccess('pc1');
  } catch (error) {
    utils.setRemoteSDPError('pc1', error);
  }
}


async function onicecandidate(e, pc) {
  if (e.candidate == null) return;
  try {
    await getOtherPc(pc).addIceCandidate(e.candidate)
  } catch (error) {
    console.log(`set ${getOtherPc(pc)} candidate failed`);
  }
}

function getRemoveTrack(e) {
  remoteVideo.srcObject = e.streams[0];
}

function getOtherPc(pc) {
  return pc === pc1 ? pc2 : pc1;
}

function getPcName(pc) {
  return pc === pc1 ? 'pc1' : 'pc2';
}
