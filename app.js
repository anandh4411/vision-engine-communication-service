const express = require("express");
const app = express();

require("dotenv").config();
require("./config/db")();
require("./config/config")();
// require("./src/routes")(app);

const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require("path");

app.use("/static", express.static("public"));

// get one users
app.get("/", (req, res) => {
  res.send({
    message:
      "Hey, this is vision-engine's Real Time Communication Microservice.",
  });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    // join the room
    socket.join(roomId);
    // say to all connected user that a new user joined
    socket.to(roomId).broadcast.emit("user-connected", userId);

    // when user lefts
    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });
});

server.listen(3002);

// const port = process.env.PORT || 3002;
// app.listen(port, () => console.log(`Listening on port ${port}..`));

module.exports = app;
