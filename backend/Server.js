const express = require("express");
const mongoose = require("mongoose");
const { createServer } = require("http");
const app = express();
const cors = require("cors");
const { Server } = require("socket.io");
const messageRoutes = require("./Routes/messageRoute");
const userRoutes = require("./Routes/userRoute");
require("dotenv").config();
const httpServer = createServer();
const databaseUrl = process.env.DATABASE_URL;
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

const port = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

mongoose
  .connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User ${socket.id} joined room ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

httpServer.listen(8000, () => {
  console.log("Socket.IO server listening on port 8000");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
