import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  //working on this!
  // const oauthFunc = async() => {
  //   const res = await
  // }
  return (
    <div style={{fontFamily: 'Anton, sans-serif'}} className='bg-gradient-to-r from-indigo-500 from-10% via-mPink to-mBlue align-left text-mBlack text-6xl'>WebsocketVid.io
      <div className="w-screen h-screen grid content-center justify-items-center">
        <div className="card w-96 h-96 bg-black shadow-2xl shadow-white content-center justify-items-center grid P.5">
          <p className="max-w-lg text-2xl font-semibold leading-loose text-gray-300 justify-self-center" >Hello, Welcome to WebsocketVid.io</p>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Username:</span>
            </label>
            <input type="text" className="input bg-gray-100 input-bordered w-full max-w-xs" />
            <label className="label">
              <span className="label-text-alt">Password:</span>
            </label>
            <input type="text" className="input input-bordered w-full max-w-x bg-gray-100" />
          </div>
        </div>
        <div className='flex flex-col w-full lg:flex-row justify-center p-4'>
          <button className="btn w-40 rounded-small" onClick={()=>navigate('/home')}>Log in</button>
          <div className="divider lg:divider-horizontal"></div>
          <button className='btn w-40 rounded-small'>Sign up</button>
        </div>
      </div>
    </div>
  )
}