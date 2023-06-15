import React, { useState, useEffect } from 'react';
import User from './User'

export default function UserList({ users, handleUserSelected }) {
  return (
    <div id="active-user-container">
      {users.map((userId) => (
        <div key={userId} id={userId}>
          <User socketId={userId} onUserSelected={handleUserSelected}/>
        </div>
      ))}
    </div>
  )
}