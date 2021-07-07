import React, { useEffect, useState, useRef } from 'react'
import { Container, Row, Col, Button, Tab } from "react-bootstrap";
import Peer from "simple-peer";
import io from 'socket.io-client'
import Video from '../../../components/Video';

export default function PeerConnection() {
  const [memberAcount, setMemberAcount] = useState(0);
  const [yourID, setYourID] = useState();
  const [peers, setPeers] = useState([]);
  const peerRefs = useRef([]);
  const socketRef = useRef();
  let userVideo = useRef();
  const userStream = useRef();
  const roomID = 1100;

  const [startOpen, setStartOpen] = useState(false)

  const start = () => {
    setStartOpen(true)
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {

      userVideo.current.srcObject = stream;
      userStream.current = stream;
      socketRef.current.emit('join-room', roomID);
    });

  }

  const stop = () => {
    userStream.current.getTracks()[0].stop();
    userVideo = null;
    setStartOpen(false);
    socketRef.current.close();

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

    socketRef.current = io.connect('//192.168.1.103:3000');
    socketRef.current.on('message', s => {
      if (socketRef.current.id) setYourID(socketRef.current.id);
    });


    socketRef.current.on('all-users', users => {
      if (users.length <= 0) return;
      const _peers = [];
      const stream = userStream.current;
      users.forEach(userID => {
        const peer = createPeer(userID, socketRef.current.id, stream);
        peerRefs.current.push({
          peerID: userID,
          peer,
        });
        _peers.push({
          peerID: userID,
          peer,
        });
      })
      setPeers(_peers);
    })

    socketRef.current.on('user-joined', payload => {
      const stream = userStream.current;
      const peer = addPeer(payload.signal, payload.callerID, stream);
      if (peerRefs.current.some(item => item.peerID === payload.callerID)) {
        let _existPeer = peerRefs.current.find(item => item.peerID === payload.callerID);
        _existPeer.peer = peer;
      } else {
        peerRefs.current.push({ peerID: payload.callerID, peer });
      }
      let _peers = peerRefs.current.map(p => p);
      setPeers(_peers);
    })

    socketRef.current.on("receiving-returned-signal", payload => {
      const item = peerRefs.current.find(p => p.peerID === payload.id);
      if (!item) return
      item.peer.signal(payload.signal);
    })
    socketRef.current.on("user-disconnect", userID => {
      const _peers = peerRefs.current.filter(current => current.peerID !== userID);
      peerRefs.current = _peers;
      setPeers(_peers)
    })

    socketRef.current.on('member-acount', n => {
      setMemberAcount(n)
    })

    window.peerRefs = peerRefs;

  }, [])


  return (
    <>
      <Row className="mb-3">
        <Col>
          YourID:{yourID}
        </Col>
        <Col>
          房间人数： {memberAcount}
        </Col>
      </Row>

      <Row>
        {
          !startOpen ? <p>
            还没有聊天室，创建一个
          <Button block onClick={start} className="btn-primary">Start</Button>
          </p>
            :
            <Button block onClick={stop} className="btn-danger">Stop</Button>

        }
      </Row>
      <Row  className="mt-3">
      {
          startOpen &&
          <Col>
            <video
              ref={userVideo}
              src="."
              autoPlay mute="true"
              style={{ border: '1px solid #ddd' ,background:'#000',width:'100%'}}
            ></video>
          </Col>
        }
      </Row>

      <h2>User list</h2>

      <Row className="mt-3">
 
        {
          peers.map(({peer}, index) => (
            <Col key={index} className="col-4">
              <Video peer={peer} />
            </Col>
          ))
        }
      </Row>

    </>
  )
}
