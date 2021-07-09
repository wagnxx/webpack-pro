import React from 'react'
import { Nav, Container } from "react-bootstrap";
export default function NavHeader({ onKeySelected, navData, activeKey }) {
  return (


    <Nav
      variant="pills" activeKey={activeKey}
      onSelect={onKeySelected}
    >
      {
        navData.map(item =>
          (
            <Nav.Item key={item.key}>
              <Nav.Link href={item.link} eventKey={item.key}>{item.text}</Nav.Link>
            </Nav.Item>
          )

        )
      }
    </Nav>

  )
}
