import React, { useEffect, useRef } from 'react'

export default function Video({ peer }) {
  let ref = useRef();
  useEffect(() => {

    console.log('有新的Peer来了', peer);

    peer.on('stream', stream => {
      ref.current.srcObject = stream;
      ref.current.mute = true;
      ref.current.autoplay = true;
      ref.current.addEventListener('loadedmetadata', () => {
        console.log('loadedmetadata play...')
        ref.current.play();
      });
    })

    return () => {
      ref.current = null;
      // ref = null;
    }
  }, []);

  return (
    <video  
      autoPlay
      height="220" ref={ref} style={{width:"100%"}}>

    </video>
  )
}
