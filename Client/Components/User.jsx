import React, { useState, useEffect, useRef } from 'react';

export default function User({ socketId, onUserSelected }) {
  return (
    <div className="bg-blue-200 w-full p-4 rounded-3xl" id={socketId} onClick={() => onUserSelected(socketId)}>
      <p className="badge badge-primary badge-outline">User: {socketId}</p>
    </div>
  )
}