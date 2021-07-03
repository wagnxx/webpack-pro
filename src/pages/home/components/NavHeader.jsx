import React from 'react'
import { Nav, Container } from "react-bootstrap";
export default function NavHeader({ onKeySelected, navData, activeKey }) {
  return (
    <Container>

      <Nav
        variant="pills" activeKey={activeKey}
        onSelect={onKeySelected}
      >
        {
          navData.map(item =>
            (
              <Nav.Item key={item.key}>
                <Nav.Link eventKey={item.key}>{item.text}</Nav.Link>
              </Nav.Item>
            )

          )
        }
      </Nav>
    </Container>
  )
}
