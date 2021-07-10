import React from 'react'
import PeerConnection from './PeerConnection';
import OneMany from './OneMany';

export default function PeercreateorByKey({ activeKey }) {

  switch (activeKey) {
    case 'peer-many':
      return <PeerConnection />
    case 'one-to-many':
      return <OneMany />

  }

}
