import Peer from 'simple-peer';
function init() {
  const p = new Peer({
    initiator: location.hash === '#1',
    trickle: false
  });

  p.on('error', (err) => console.log('error', err));

  p.on('signal', (data) => {
    console.log('SIGNAL', JSON.stringify(data));
    document.querySelector('#outgoing').textContent = JSON.stringify(data);
  });

  document.querySelector('#form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    p.signal(JSON.parse(document.querySelector('#incoming').value))
  });

  p.on('connect', () => {
    console.log('CONNECT');
    p.send(Math.random());
  });

  p.on('message', (data) => {
    console.log('data: ' + data);
  });
}



export default function app() {
  // window.addEventListener('load', init)
  // window.addEventListener('load', start);
  init()
}