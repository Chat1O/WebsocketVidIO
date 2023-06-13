import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [connectbtn, setconnectbtn] = useState(true);
  const videoRef = useRef(null);


  // on component mount,
  useEffect(() => {
    // checkif browser supports the media devices api
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          // attach the video stream
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.log(err);
        })
    }

    // cleanup function to stop the video stream
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    }
  }, []);

  // make connection to websocket and change the connect button
  function connectButtonHit() {
    // change the button
    connectbtn ? setconnectbtn(false) : setconnectbtn(true);    

  }

  return (
    <div className="w-screen h-screen bg-blue-100 flex justify-center items-center">
      <div className="card w-2/3 h-2/3 shadow-xl border bg-base-100 flex flex-col justify-center items-center">
        <div className="flex justify-between">
          <video className="h-2/3" id="videoplayer" ref={videoRef} autoPlay/>
          <video className="h-2/3" id="otherVideo" autoPlay/>
        </div>
        <p className="max-w-lg text-2xl font-semibold leading-loose text-gray-900 dark:text-white justify-self-center" >Hello, Welcome to WebsocketVid.io</p>
        <button className="btn" onClick={connectButtonHit}>{connectbtn ? 'Connect' : 'Disconnect'}</button>
      </div>
    </div>
  )
}