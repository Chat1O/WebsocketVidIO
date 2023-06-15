import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import UserList from './userList';
// import Chatbox from './Chatbox';
import Input from './Input';
import Chat from './Chat';

export default function Home() {
  const [connectbtn, setconnectbtn] = useState(true);
  const localVideoRef = useRef(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [curSelectedSocket, setcurSelectedSocket] = useState('');
  const socketRef = useRef(null);
  const curSelectedSocketRef = useRef(curSelectedSocket);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    curSelectedSocketRef.current = curSelectedSocket;
  }, [curSelectedSocket]);

  function connectButtonHit() {
    setconnectbtn((cur) => !cur);
    console.log(socketRef.current);
  }

  // this will call the user
  function handleUserSelected(socketId, message) {
    setcurSelectedSocket(socketId);
    if (socketRef.current) {
      socketRef.current.emit('send-message', {
        socket: socketId,
        message: message,
      });
    }
  }

  // event listeners for socket.io
  useEffect(() => {
    // peerRef.current = new Peer(socketRef.current.socketId);

    socketRef.current = io('http://localhost:3000');
    socketRef.current.on('update-user-list', ({ users }) => {
      setActiveUsers(users);
    });

    socketRef.current.on('remove-user', ({ socketId }) => {
      setActiveUsers((prevUsers) =>
        prevUsers.filter((cur) => cur !== socketId)
      );
    });

    // add new chat components
    socketRef.current.on('get-message', (data) => {
      const newEle = <Chat key={data.socket} socketId={data.socket} message={data.message} />;
      setMessages((prev) => [...prev, newEle]);
    });

    // set up video stream
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.warn(error.message);
      });

    // disconnect on unmount
    // disconnect on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-blue-100 flex justify-center items-center">
      <UserList users={activeUsers} handleUserSelected={handleUserSelected} />
      <div className="card w-2/3 h-2/3 shadow-xl border bg-white flex flex-col justify-center items-center">
        <div className="flex justify-between">
          <video
            className="h-2/3 w-full"
            id="localVideo"
            ref={localVideoRef}
            autoPlay
          />
          <div className="w-max h-m">
            {messages}
            <Input
              socketId={socketRef.current?.id}
              onSendMessage={handleUserSelected}
            />
          </div>
        </div>
        <p className="max-w-lg text-2xl font-semibold leading-loose text-gray-900 dark:text-white justify-self-center">
          Hello, Welcome to WebsocketVid.io
        </p>
        <div className="flex">
          <button className="btn" onClick={connectButtonHit}>
            {connectbtn ? 'Connect' : 'Disconnect'}
          </button>
          <button className="btn">send message</button>
          <p className="btn">Selected: {curSelectedSocket}</p>
        </div>
      </div>
    </div>
  );
}
