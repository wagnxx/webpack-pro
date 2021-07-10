import React from 'react'
import { Row, Col, ButtonGroup, Button, ButtonToolbar, ListGroup } from 'react-bootstrap'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import io from 'socket.io-client'
import '../css/one-many.css'

export default function OneMany() {

  const [yourID, setYourID] = useState('');
  const [roomID, setRoomID] = useState();
  const [memberNum, setMemberNum] = useState(0);
  const [memberIDS, setMemberIDS] = useState([]);
  const [roomCreated, setRoomCreated] = useState(false);
  const socketRef = useRef();
  const userPeerRef = useRef();
  const initiatorPeerRef = useRef();
  const loacalStreamRef = useRef();
  const videoRef = useRef();

  const createRoom = e => {
    if (roomID) return;
    e.preventDefault();
    if (socketRef.current) {
      socketRef.current.emit('create-room');
      createInitiatorPeer();
    }

  }

  const openCamr = async (e) => {
    if (!roomID) return;
    e.preventDefault();
    try {
      const loacalStream = await navigator.mediaDevices.getUserMedia({ video: true });
      loacalStreamRef.current = loacalStream;
      if (videoRef.current) {
        videoRef.current.srcObject = loacalStream;
        initiatorPeerRef.current.addStream(loacalStream);
      }

    } catch (error) {
      console.log('open camar failed')
    }
  }
  const stopHandle = e => {
    if (initiatorPeerRef.current.destroyed) return;
    e.preventDefault();
    initiatorPeerRef.current.send('close');
    initiatorPeerRef.current.destroy();
    loacalStreamRef.current.getTracks()[0].stop()
    socketRef.current.close();

  }

  const createInitiatorPeer = stream => {
    const initiatorPeer = new Peer({
      initiator: true,
      trickle: false,
    });
    initiatorPeerRef.current = initiatorPeer;

    initiatorPeer.on('signal', signal => {
      socketRef.current.emit('initiatorPeer-created', signal)
    });
    initiatorPeer.on('connect', () => {
      console.log('initiator Peer connected state : ', initiatorPeer.connected)
    })
  }

  const callHandle = e => {
    e.preventDefault();
    const userPeer = new Peer({ initiator: true, trickle: false });
    socketRef.current.emit('join-room', { roomId: roomID })

    userPeer.on('signal', signal => {
      socketRef.current.emit('user-send-signal', signal)
    })

    userPeer.on('close', () => {
      console.log('user closed')
    })

    userPeer.on('error', err => {
      console.log('user peer error', err);
    })

    userPeer.on('stream', stream => {
      console.log('user stream is received : ', stream);
      videoRef.current.srcObject = stream;
      videoRef.current.autoplay = true;
    })

    window.userPeer = userPeer;
    userPeerRef.current = userPeer;
  }

  useEffect(() => {
    const socket = io.connect('//192.168.1.103:3000');
    socketRef.current = socket;

    socket.on('room-list', rooms => {
      if (rooms[0]) {
        setRoomID(rooms[0]);
      }
    });

    socket.on('create-room-success', id => {
      setRoomID(id);
    });

    socket.on('room-created', length => {
      setRoomCreated(length > 0);
    });

    socket.on('answer-initiator', signal => {
      initiatorPeerRef.current.signal(signal);
    });
    socket.on('all-users', users => {
      console.log('all suers ', users);
      setMemberIDS(users);
      // setMemberNum(users.length);
    })
    socket.on('return-user-signal', signal => {
      userPeerRef.current.signal(signal)
    })

    socket.on('message', (id) => {
      setYourID(id)
    })

    socket.on('member-acount', (n) => {
      setMemberNum(n);
    })

    return () => {
      socket.close();
    }
  }, [])
  return (
    <div>
      <h3 className="mt-3">One Many page</h3>
      <Row className="mt-3 mb-3 no-gutters">
        <ListGroup>
          <ListGroup.Item action variant="info">YourID：{yourID}</ListGroup.Item>
          <ListGroup.Item action variant="info">RoomID：{roomID}</ListGroup.Item>
          <ListGroup.Item action variant="info">Members Num：{memberNum}</ListGroup.Item>
          <ListGroup.Item action variant="info">Members ids：[ {memberIDS.join()}]</ListGroup.Item>
        </ListGroup>

      </Row>
      <Row className="mt-3 mb-3">
        <Col>
          <video muted autoPlay ref={videoRef}></video>
        </Col>
      </Row>
      <Row className="mt-3 mb-3">
        {
          !roomCreated ?

            <Col>
              <ButtonToolbar>
                <ButtonGroup aria-label="group1">
                  <Button onClick={createRoom}>Create Room</Button>
                  <Button variant="secondary" onClick={openCamr}>Start</Button>
                </ButtonGroup>
                <ButtonGroup className="ml-1" aria-label="group2">
                  <Button variant="secondary" onClick={stopHandle}>Stop</Button>
                </ButtonGroup>
              </ButtonToolbar>
            </Col>
            :
            <Col>
              <ButtonToolbar>
                <ButtonGroup aria-label="group1">
                  <Button onClick={callHandle}>Call</Button>
                </ButtonGroup>
                <ButtonGroup className="ml-1" aria-label="group2">
                  <Button variant="secondary">Hang</Button>
                </ButtonGroup>
              </ButtonToolbar>
            </Col>
        }


      </Row>
    </div>
  )
}
