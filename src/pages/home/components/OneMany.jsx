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
  const initiatorPeerRef = useRef();

  const createRoom = e => {
    e.preventDefault();
    socketRef.current.emit('create-room');
    const initiatorPeer = new Peer({
      initiator: false,
      trickle: false,
    });
    initiatorPeerRef.current = initiatorPeer;

    initiatorPeer.on('signal', signal => {
      socketRef.current.emit('initiatorPeer-created', signal)
    })
  }

  const openCamr = e => {
    e.preventDefault();
    navigator.mediaDevices.getUserMedia({ video: true })
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
    socket.on('user-list', users => {
      setMemberIDS(users);
      setMemberNum(users.length);
     })

    socket.on('message', (id) => {
      setYourID(id)
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
          <ListGroup.Item action variant="info">Members ids：[ {memberIDS} ]</ListGroup.Item>
        </ListGroup>

      </Row>
      <Row className="mt-3 mb-3">
        <Col>
          <video src="." muted ></video>
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
                  <Button variant="secondary">Stop</Button>
                </ButtonGroup>
              </ButtonToolbar>
            </Col>
            :
            <Col>
              <ButtonToolbar>
                <ButtonGroup aria-label="group1">
                  <Button >Call</Button>
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
