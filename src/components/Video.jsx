import React, { useEffect, useRef } from 'react'

export default function Video({ peer }) {
  let ref = useRef();
  useEffect(() => {

    console.log('有新的Peer来了', peer);

    peer.on('stream', stream => {
      ref.current.srcObject = stream;
      ref.current.mute = true;
      if (ref.current.paused) {
        ref.current.play();
      }
    })

    return () => {
      ref.current = null;
      // ref = null;
    }
  }, []);

  return (
    <video width="300"
      height="220" ref={ref}>

    </video>
  )
}
