import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  //working on this!
  // const oauthFunc = async() => {
  //   const res = await
  // }
  return (
    <div className="w-screen h-screen bg-blue-100 grid content-center justify-items-center">
      <div className="card w-96 h-96 bg-base-100 shadow-xl content-center justify-items-center grid P.5">
        <p className="max-w-lg text-2xl font-semibold leading-loose text-gray-900 dark:text-white justify-self-center" >Hello, Welcome to WebsocketVid.io</p>
        <button className="btn w-64 rounded-full" onClick={()=>navigate('/home')}>Log in</button>
      </div>
    </div>
  )
}