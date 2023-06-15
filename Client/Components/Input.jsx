import React, {useState} from 'react';

// input button that invokes onsendmessage with the socketid 
// when the form is submitted
export default function Input( { socketId, onSendMessage }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents page refresh
    onSendMessage(socketId, input); // Call your onSendMessage function with socketId and message
    setInput(''); // Clear the input field after sending the message
  };

  function onHandleChange(e) {
    setInput(e.target.value);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" className="w-full" onChange={onHandleChange} placeholder="type message" value={input}/>
        <button type="submit" className="btn" >Send</button>
      </form>
    </div>
  )
}