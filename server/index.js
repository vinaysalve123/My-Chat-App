const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const PORT = process.env.PORT || 3003;
require("dotenv").config();

const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "https://my-chat-app-iota-eight.vercel.app", // frontend domain
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`socket ${socket.id} connected`);

  socket.on("sent_message/emit", (data) => {
    console.log("Message received:", data);
    io.emit("rec_message", data); // send to ALL clients (including sender)
  });
});

server.listen(PORT, () => {
  console.log("Server is running using socket.io with port:", PORT);
});
