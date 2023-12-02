const Message = require("../Models/Message");
const authMiddleware = require("../Middleware/Auth");
const { createServer } = require("http");

const httpServer = createServer();
const { Server } = require("socket.io");

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
const messageController = {
  // Function to get all messages
  getAllMessages: async (req, res) => {
    try {
      const token = req.header("Authorization").split(" ")[1];
      const user = authMiddleware.verifyToken(token);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }
      const messages = await Message.find().sort({ timestamp: 1 });

      res.json(messages);
    } catch (error) {
      console.error("Error getting messages:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  createMessageWithWebSocket: async (req, res) => {
    const token = req.header("Authorization").split(" ")[1];
    const user = authMiddleware.verifyToken(token);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    const { text, time } = req.body;
    const username = user.username;

    try {
      const newMessage = await Message.create({
        user: user.userId,
        text,
        username,
        time,
      });

      // Emit the new message to all connected clients
      //io.emit("newMessage", newMessage);

      res.status(201).json(newMessage);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = messageController;
