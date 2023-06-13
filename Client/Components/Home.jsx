import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

export default function Home() {
  const [connectbtn, setconnectbtn] = useState(true);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const socket = io('http://localhost:3000');
    
  // make connection to websocket and change the connect button
  async function connectButtonHit() {
    // change the button
    connectbtn ? setconnectbtn(false) : setconnectbtn(true);    
    
    // set up socket 
    socket.connect();

    // set up rtcpeer connection
    const peers = new RTCPeerConnection(null);
    setPeerConnection(peers);

    peers.onaddstream = function (e) {
      remoteVideoRef.current.srcObject = event.stream;
    };

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    localVideoRef.current.srcObject = stream;
    stream.getTracks().forEach(track => peers.addTrack(track, stream));

    const offer = await peers.createOffer();
    await peers.setLocalDescription(offer);
    socket.emit('signal', offer);
  }


  // on component mount, display local video
  useEffect(() => {
    // checkif browser supports the media devices api
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          // attach the video stream
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.log(err);
        })
    }
    // cleanup function to stop the video stream
    return () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    }
  }, []);

  useEffect(() => {
    socket.on('signal', async message => {
      console.log('here');
      if (!peerConnection) return;
      await peerConnection.setRemoteDescription(message);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit('signal', answer);
    });

    socket.on('ice', candidate => {
      if (!peerConnection) return;
      peerConnection.addIceCandidate(candidate);
    });

    return () => {
      socket.disconnect();
    }
  }, [peerConnection]);

  function sndmsg() {
    socket.connect();
    socket.emit('chat message', 'hello')
  }

  return (
    <div className="w-screen h-screen bg-blue-100 flex justify-center items-center">
      <div className="card w-2/3 h-2/3 shadow-xl border bg-base-100 flex flex-col justify-center items-center">
        <div className="flex justify-between">
          <video className="h-2/3" id="localVideo" ref={localVideoRef} autoPlay/>
          <video className="h-2/3" id="remoteVideo" autoPlay/>
        </div>
        <p className="max-w-lg text-2xl font-semibold leading-loose text-gray-900 dark:text-white justify-self-center" >Hello, Welcome to WebsocketVid.io</p>
        <div className="flex">
          <button className="btn" onClick={connectButtonHit}>{connectbtn ? 'Connect' : 'Disconnect'}</button>
          <button className="btn" onClick={sndmsg}>send message</button>
        </div>
      </div>
    </div>
  )
}