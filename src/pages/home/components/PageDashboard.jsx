import React from 'react'
import { Tabs, Tab } from "react-bootstrap";

 
export default function PageDashboard() {
  return (

    <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
      <Tab eventKey="home" title="home">
        <div>home</div>
      </Tab>
      <Tab eventKey="profile" title="profile">
        <div>profile</div>
      </Tab>
      <Tab eventKey="dashboard" title="dashboard">
        <div>dashboard</div>
      </Tab>

    </Tabs>

  )
}

