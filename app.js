const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const cors = require("cors");
const corsOptions = require("./config/cors");
const loggerMiddleware = require("./src/middlewares/logger");

require("dotenv").config();
// require("./config/db")();
// require("./config/config")();

const app = express();
const server = http.createServer(app);

app.use(express.json());
// app.use(cors(corsOptions));
app.use(loggerMiddleware);

// https://visionengine.vercel.app

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    credentials: true, // If needed
  },
});

// app.use(
//   cors({
//     origin: "http://localhost:4200",
//   })
// );

app.use(cors());

app.get("/", (req, res) => {
  res.send({
    message:
      "Hey, this is vision-engine's Real Time Communication Microservice.",
  });
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("create-room", (roomId) => {
    rooms[roomId] = socket;
    console.log(`Room created: ${roomId}`);
  });
  socket.on("request-join-room", (roomId, peerId) => {
    console.log("requested");
    const hostSocket = rooms[roomId];
    if (hostSocket) {
      hostSocket.emit("user-requested", socket.id, roomId, peerId);
    }
  });
  socket.on("added-to-call", (roomId) => {
    const hostSocket = rooms[roomId];
    if (hostSocket) {
      hostSocket.emit("you-are-added", roomId);
      console.log("added");
    }
  });
  socket.on("join-room", (roomId) => {
    const hostSocket = rooms[roomId];
    if (hostSocket) {
      hostSocket.emit("user-joined", socket.id);
      console.log(`User joined room: ${roomId}`);
    } else {
      console.log(`Room not found: ${roomId}`);
    }
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Remove the socket from rooms if needed
    // Delete rooms[roomId];
  });
});

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
