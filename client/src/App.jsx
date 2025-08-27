import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io.connect("https://my-chat-app-ez0b.onrender.com");

export default function App() {
  const [message, setMessage] = useState("");
  const [displayMessages, setDisplayMessages] = useState(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
  });

  const sendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = { message, self: true };
    setDisplayMessages((prev) => [...prev, newMessage]);

    socket.emit("sent_message/emit", { message });
    setMessage("");
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setDisplayMessages((prev) => [...prev, { message: data.message, self: false }]);
    };

    socket.on("rec_message", handleReceiveMessage);

    return () => {
      socket.off("rec_message", handleReceiveMessage);
    };
  }, []);

  // Save messages in localStorage
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(displayMessages));
  }, [displayMessages]);

  return (
    <div className="chat-wrapper">
      <h1>Simple Chat App</h1>
      <div className="container">
        <input
          required
          type="text"
          placeholder="Type a Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div className="chat-box">
        {displayMessages.map((msg, index) => (
          <div
            key={index}
            className={`chat-bubble ${msg.self ? "self" : "other"}`}
          >
            {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
}
