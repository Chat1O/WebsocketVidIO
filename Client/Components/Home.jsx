import React, { useState, useEffect } from 'react';

export default function Home() {
  const [connectbtn, setconnectbtn] = useState(true);

  return (
    <div className="w-screen h-screen bg-blue-100 flex justify-center items-center">
      <div className="card w-2/3 h-2/3 shadow-xl border bg-base-100">
        <video id="videoplayer">

        </video>
        <p className="max-w-lg text-2xl font-semibold leading-loose text-gray-900 dark:text-white justify-self-center" >Hello, Welcome to WebsocketVid.io</p>
        <button className="btn">{connectbtn ? 'Connect' : 'Disconnect'}</button>
      </div>
      
    </div>
  )
}