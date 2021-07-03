import React, { useEffect, useState, useRef } from 'react'
import { Container, Row, Col, Button, Tab } from "react-bootstrap";
import Peer from "simple-peer";
import io from 'socket.io-client'
import Video from '../../../components/Video';

export default function PeerConnection() {

  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const userStream = useRef();
  const roomID = 1;

  const start = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {

      userVideo.current.srcObject = stream;
      userStream.current = stream;
      socketRef.current.emit('join-room', roomID);
    });

  }

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });
    peer.on('signal', signal => {
      socketRef.current.emit('sending-signal', {
        userToSignal, callerID, signal
      })
    })
    peer.on('close', signal => {
      socketRef.current.emit('disconnect', callerID)
    })

    return peer;
  }

  function addPeer(incommingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });
    peer.on('signal', signal => {
      socketRef.current.emit('returning-signal', { signal, callerID });
    })
    peer.signal(incommingSignal);

    return peer;
  }



  useEffect(() => {
    socketRef.current = io.connect('http://localhost:3000');
  }, [socketRef])

  useEffect(() => {
    socketRef.current.on('all-users', users => {
      if (users.length <= 0) return;
      const peers = [];
      const stream = userStream.current;
      debugger
      users.forEach(userID => {
        const peer = createPeer(userID, socketRef.current.id, stream);
        peersRef.current.push({
          peerID: userID,
          peer,
        })
        peers.push(peer);
      })
      setPeers(peers);
    })

    socketRef.current.on('user-joined', payload => {
      const stream = userStream.current;
      const peer = addPeer(payload.signal, payload.callerID, stream);
      peersRef.current.push({
        peerID: payload.callerID,
        peer,
      })
      setPeers(prePeers => [...prePeers, peer]);
    })

    socketRef.current.on("receiving-returned-signal", payload => {
      const item = peersRef.current.find(p => p.peerID === payload.id);
      item.peer.signal(payload.signal);
    })
    socketRef.current.on("user-disconnect", userID => {
      const peersRefLeaved = peersRef.current.find(current => current.peerID === userID);
      const inRefsIndex = peersRef.current.indexOf(peersRefLeaved);
      peersRef.current.splice(inRefsIndex, 1);
      setPeers(prePeers => {
        let _peers = [...prePeers];
        const inPeersIndex = _peers.indexOf(peersRefLeaved);
        _peers.splice(inPeersIndex, 1);
        return _peers;
      })
    })


  }, [socketRef]);

  return (
    <Container>
      <h2>Peer connection page</h2>
      <Button onClick={start}>Start</Button>
      <Row>
        <Col>
          <video
            ref={userVideo}
            src="."
            autoPlay mute="true"
            width="300"
            height="220"
            style={{ border: '1px solid #ddd' }}
          ></video>
        </Col>
        {
          peers.map((peer, index) => (
            <Col key={index}>
              <Video peer={peer} />
            </Col>
          ))
        }
      </Row>

      <Row>
  
      </Row>
    </Container>
  )
}
