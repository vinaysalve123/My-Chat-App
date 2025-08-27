const express = require("express");
const app = express();
const http = require("http");
const {Server} = require("socket.io");
const cors = require("cors");
const PORT = process.env.PORT || 3003;
require("dotenv").config();

const server = http.createServer(app);  //Create dummy server
// console.log(server);

app.use(cors());


const io = new Server(server, {
    cors:{
        origin: "https://my-chat-app-iota-eight.vercel.app/",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
  console.log(`socket ${socket.id} connected`);

  // an event was received from the client
  socket.on("sent_message/emit",(data)=>{
    console.log(data);
    socket.broadcast.emit("rec_message", data);
  })
})

server.listen(PORT, ()=>{
    console.log("Server is running using socket.io with port:", PORT);
});