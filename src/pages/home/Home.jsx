import React, { useState } from 'react'
import { Container } from "react-bootstrap";
import NavHeader from "./components/NavHeader";
import menus from "../../config/menus";
import PeercreateorByKey from "./components/PeercreateorByKey";
export default function Home() {
  const [navData, setNavData] = useState(() => {
    return menus.map(item => {
      item.link = item.link.replace('/#', '#');
      return item;
    })
  });
  const [activeKey, setActiveKey] = useState(() => {
    let activeItem = menus.find(item => item.actived);
    if (activeItem) return activeItem.key;
    return menus[0].key;
  })

  const onKeySelected = key => {
    setActiveKey(key)
  }

  return (

    <Container>
      <NavHeader
        activeKey={activeKey}
        navData={navData}
        onKeySelected={onKeySelected}
      />
      <PeercreateorByKey activeKey={activeKey} />
    </Container>
  )
}

