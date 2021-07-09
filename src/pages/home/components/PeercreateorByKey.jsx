import React from 'react'
import PeerConnection from './PeerConnection';
import OneMany from './OneMany';

export default function PeercreateorByKey({ activeKey }) {

  let PeerComponent;
  switch ('one-to-many') {
    case 'peer-many':
      PeerComponent = PeerConnection;
      break;
    case 'one-to-many':
      PeerComponent = OneMany;
      break
  }
  return (
    <PeerComponent />
  )
}
