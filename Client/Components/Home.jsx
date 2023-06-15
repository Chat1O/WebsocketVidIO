import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import UserList from './userList';
import { Peer } from 'peerjs';

export default function Home() {
  const [connectbtn, setconnectbtn] = useState(true);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [curSelectedSocket, setcurSelectedSocket] = useState('');
  const socketRef = useRef(null);
  const curSelectedSocketRef = useRef(curSelectedSocket);



  useEffect(() => {
    curSelectedSocketRef.current = curSelectedSocket;
  }, [curSelectedSocket])

  function connectButtonHit() {
    setconnectbtn(cur => !cur);
  }

  // this will call the user
  async function handleUserSelected(socketId) {
    
    setcurSelectedSocket(socketId);
    // peerRef.current = new Peer(socketRef.current.socketId);
    // // const conn = peerRef.current.connect(socketId);
    // socketRef.current.emit('call-user', {
    //   to: socketId,
    // });
    if (socketRef.current) {
      socketRef.current.emit('send-message', {
        to: socketId,
        message: 'test'
      });
    }
  }

  // event listeners for socket.io
  useEffect(() => {
    // peerRef.current = new Peer(socketRef.current.socketId);

    socketRef.current = io('http://localhost:3000');
    socketRef.current.on('update-user-list', ({ users }) => {
      setActiveUsers(users);
    })

    socketRef.current.on('remove-user', ({ socketId }) => {
      setActiveUsers(prevUsers => prevUsers.filter(cur => cur !== socketId));
    })

    socketRef.current.on('get-message', (data) => {
      console.log('from socket: ', data.socket)
      console.log('message ', data.message);
    })

    // set up video stream
    navigator.mediaDevices.getUserMedia({
      video: true
    }) 
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        // stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
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