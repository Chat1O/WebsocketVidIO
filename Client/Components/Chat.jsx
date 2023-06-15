import React from 'react'

export default function Chat({socketId, message}) {

  return (
    <div>
      <div className="chat chat-start">
        <div className="chat-header">
          {socketId}
          <time className="text-xs opacity-50">{Date.now()}</time>
        </div>
        <div className="chat-bubble">{message}</div>
        <div className="chat-footer opacity-50">
        Delivered
        </div>
      </div>
    </div>
  )
}