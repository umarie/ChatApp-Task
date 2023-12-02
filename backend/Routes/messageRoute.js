// routes/messageRoutes.js
const express = require('express');
const messageController = require('../Controllers/messageController');

const router = express.Router();

// GET all messages
router.get('/', messageController.getAllMessages);

// POST a new message
router.post('/send', messageController.createMessageWithWebSocket);


module.exports = router;
