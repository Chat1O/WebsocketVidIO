import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import UserList from './userList';

let peerConnection;

export default function Home() {
  const [connectbtn, setconnectbtn] = useState(true);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [curSelectedSocket, setcurSelectedSocket] = useState('');
  const socketRef = useRef(null);
  const [isAlreadyCalling, setIsAlreadyCalling] = useState(false);

  function connectButtonHit() {
    setconnectbtn(cur => !cur);
  }

  // this will call the user
  async function handleUserSelected(socketId) {
    setcurSelectedSocket(socketId);

    // is this correct?
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

    socketRef.current.emit('call-user', {
      offer,
      to: socketId
    })
    setIsAlreadyCalling(false);
  }

  // event listeners for socket.io
  useEffect(() => {
    const { RTCPeerConnection, RTCSessionDescription } = window;
    peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: ['stun:stun1.l.google.com:19302']
        },
        
      ]
      ,iceCandidatePoolSize: 10,
    });

    peerConnection.ontrack = function({ streams: [stream] }) {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    }

    socketRef.current = io('http://localhost:3000');
    socketRef.current.on('update-user-list', ({ users }) => {
      setActiveUsers(users);
    })

    socketRef.current.on('remove-user', ({ socketId }) => {
      setActiveUsers(prevUsers => prevUsers.filter(cur => cur !== socketId));
    })

    // react to call made emitter
    socketRef.current.on('call-made', async data => {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

      socketRef.current.emit('make-answer', {
        answer,
        to: data.socketId
      })
    })

    // answer made event
    socketRef.current.on('answer-made', async data => {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );

      if (!isAlreadyCalling) {
        handleUserSelected(data.socketId);
        setIsAlreadyCalling(true);
      }
    })

    // handle ice candidates
    peerConnection.onicecandidate = function (event) {
      if (event.candidate) {
        socketRef.current.emit('new-ice-candidate', {
          candidate: event.candidate,
          to: curSelectedSocket
        })
      }
    }

    // handle ice candidate from remote peer
    socketRef.current.on('new-ice-candidate', function(data) {
      if (data.candidate) {
        const rtcIceCandidate = new window.RTCIceCandidate(data.candidate);
        peerConnection.addIceCandidate(rtcIceCandidate)
      }
    })

    // set up video stream
    navigator.mediaDevices.getUserMedia({
      video: true
    }) 
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
      })
      .catch((error) => {
        console.warn(error.message);
      })

    // disconnect on unmount
    return () => {
      socketRef.current.disconnect();
    }
  },[]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
      console.log('remoteVideoRef is connected');
    } else {
      console.log('remoteVideoRef is not connected');
    }
  }, [remoteVideoRef.current?.srcObject]);

  return (
    <div className="w-screen h-screen bg-blue-100 flex justify-center items-center">
      <UserList users={activeUsers} handleUserSelected={handleUserSelected}/>
      
      <div className="card w-2/3 h-2/3 shadow-xl border bg-base-100 flex flex-col justify-center items-center">
        <div className="flex justify-between">
          <video className="h-2/3 w-full" id="localVideo" ref={localVideoRef} autoPlay/>
          <video className="h-2/3 w-full" id="remoteVideo"ref={remoteVideoRef} autoPlay/>
        </div>
        <p className="max-w-lg text-2xl font-semibold leading-loose text-gray-900 dark:text-white justify-self-center" >Hello, Welcome to WebsocketVid.io</p>
        <div className="flex">
          <button className="btn" onClick={connectButtonHit}>{connectbtn ? 'Connect' : 'Disconnect'}</button>
          <button className="btn">send message</button>
          <p>Selected: {curSelectedSocket}</p>
        </div>
      </div>
    </div>
  )
}