import {useEffect, useState} from 'react'
import "./App.css"
import io from "socket.io-client";


const socket = io.connect("https://my-chat-app-ez0b.onrender.com/");

export default function App() {
  const [message, setMessage] = useState("");
  const [displayMessage, setDisplayMessage] = useState("");
  // const [displayMessage, setDisplayMessage] = useState([]);
  
  const sendMessage = ()=>{
    if(message.trim() === "")return;

    socket.emit("sent_message/emit",{   //Transfer/Sent  message/event to the server
      // message: message
      message
    })
    // setDisplayMessage([...displayMessage, message]);
    // setDisplayMessage(message);
    setMessage("");
  }

  useEffect(()=>{
    const handleReceiveMessage = (data)=>{
      setDisplayMessage(data.message);
      alert(data.message);
    }

    socket.on("rec_message", handleReceiveMessage);

    return ()=>{
      socket.off("rec_message", handleReceiveMessage);
    }
  },[])

  return (
    <>
      <h1>Simple Chat App</h1>
      <div className="container">
        <input required type="text" placeholder='Type a Message' value={message} onChange={(e)=>setMessage(e.target.value)}/>
        <button onClick={sendMessage}>Send Message</button>
      </div>

      {/* <div>
        <ul>
          {
            displayMessage.filter((current, index)=> (
              <li key={index} ><h1>{current}</h1> <br /> </li>
              
            ))
          }
        </ul>
      </div> */}

      <h1>The Message is : {displayMessage}</h1>
    </>
  )
}
