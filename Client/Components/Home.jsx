import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import User from './User';
import UserList from './userList';


export default function Home() {
  const [connectbtn, setconnectbtn] = useState(true);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [test, setTest] = useState('');

  //const socket = io('http://localhost:3000');

  function connectButtonHit() {
    setconnectbtn(cur => !cur);
  }

  function handleUserSelected(socketId) {
    setTest(socketId);
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

  // event listeners for socket.io
  useEffect(() => {
    const socket = io('http://localhost:3000');
    socket.on('update-user-list', ({ users }) => {
      setActiveUsers(users);
      console.log(activeUsers)
    })

    socket.on('remove-user', ({ socketId }) => {
      setActiveUsers(activeUsers.filter(cur => cur === socketId));
    })

    return () => {
      socket.disconnect();
    }
  },[]);

  return (
    <div className="w-screen h-screen bg-blue-100 flex justify-center items-center">
      <UserList users={activeUsers} handleUserSelected={handleUserSelected}/>
      
      <div className="card w-2/3 h-2/3 shadow-xl border bg-base-100 flex flex-col justify-center items-center">
        <div className="flex justify-between">
          <video className="h-2/3" id="localVideo" ref={localVideoRef} autoPlay/>
          <video className="h-2/3" id="remoteVideo" autoPlay/>
        </div>
        <p className="max-w-lg text-2xl font-semibold leading-loose text-gray-900 dark:text-white justify-self-center" >Hello, Welcome to WebsocketVid.io</p>
        <div className="flex">
          <button className="btn" onClick={connectButtonHit}>{connectbtn ? 'Connect' : 'Disconnect'}</button>
          <button className="btn">send message</button>
          <p>Selected: {test}</p>
        </div>
      </div>
    </div>
  )
}