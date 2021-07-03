import React from 'react'
import { Tabs, Tab } from "react-bootstrap";
import PeerConnection from './components/PeerConnection';

 
export default function Home() {
  return (

    <Tabs defaultActiveKey="peer-many" id="uncontrolled-tab-example">
      <Tab eventKey="peer-many" title="peer-many">
        场景： 多人聊天室内
        <PeerConnection />
      </Tab>
      <Tab eventKey="one-to-many" title="one-to-many">
        <div>场景：主播 ====》 万千粉丝</div>
      </Tab>
      <Tab eventKey="many-discuss" title="many-discuss">
        <div>场景：主持人和几位嘉宾讨论，====》  观众听</div>
      </Tab>
      <Tab eventKey="peers-merge" title="peers-merge">
        <div>把以上几个场景融为一体</div>
      </Tab>
    </Tabs>

  )
}

