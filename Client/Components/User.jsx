import React, { useState, useEffect, useRef } from 'react';

export default function User({ socketId, onUserSelected }) {
  return (
    <div className="bg-blue-200 w-full p-4" id={socketId} onClick={() => onUserSelected(socketId)}>
      <p className="username">Socket: {socketId}</p>
    </div>
  )
}