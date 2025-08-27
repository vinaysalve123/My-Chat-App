import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io.connect("https://my-chat-app-ez0b.onrender.com");

export default function App() {
  const [message, setMessage] = useState("");
  const [displayMessages, setDisplayMessages] = useState([]);

  const sendMessage = () => {
    if (message.trim() === "") return;

    socket.emit("sent_message/emit", { message });
    setMessage("");
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setDisplayMessages((prev) => [...prev, data.message]);
    };

    socket.on("rec_message", handleReceiveMessage);

    return () => {
      socket.off("rec_message", handleReceiveMessage);
    };
  }, []);

  return (
    <>
      <h1>Simple Chat App</h1>
      <div className="container">
        <input
          required
          type="text"
          placeholder="Type a Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send Message</button>
      </div>

      <ul>
        {displayMessages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </>
  );
}
