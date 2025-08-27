import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io.connect("https://my-chat-app-ez0b.onrender.com");

export default function App() {
  const [message, setMessage] = useState("");
  const [displayMessages, setDisplayMessages] = useState(() => {
    // Load messages from localStorage on initial render
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
  });

  const sendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = { message, self: true };

    // Optimistically update local state
    setDisplayMessages((prev) => [...prev, newMessage]);

    // Send message to server
    socket.emit("sent_message/emit", { message });

    setMessage("");
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      // Mark received messages with self=false
      setDisplayMessages((prev) => [...prev, { message: data.message, self: false }]);
    };

    socket.on("rec_message", handleReceiveMessage);

    return () => {
      socket.off("rec_message", handleReceiveMessage);
    };
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(displayMessages));
  }, [displayMessages]);

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
          <li
            key={index}
            style={{ textAlign: msg.self ? "right" : "left", color: msg.self ? "blue" : "green" }}
          >
            {msg.message}
          </li>
        ))}
      </ul>
    </>
  );
}
