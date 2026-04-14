const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());

// MongoDB connect
mongoose.connect("mongodb://127.0.0.1:27017/chat");

// Schema
const MessageSchema = new mongoose.Schema({
  name: String,
  message: String,
});

const Message = mongoose.model("Message", MessageSchema);

// Server create
const server = http.createServer(app);

// Socket setup
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("send_message", async (data) => {
  await Message.create({
    name: data.name,
    message: data.message,
  });

  io.emit("receive_message", data);
});

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Server start
server.listen(5000, () => {
  console.log("Server running on port 5000");
});