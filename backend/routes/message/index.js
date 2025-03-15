const express = require('express');
const { chat } = require('../../controllers'); // Import chat controller
const router = express.Router();

router.post('/start-chat', chat.startChat); // Start a chat (or get existing)
router.get('/fetch-chats', chat.fetchChats); // Get all chats for a user
router.post('/send-message', chat.sendMessage); // Send a message in a chat
router.get('/fetch-messages', chat.fetchMessages); // Fetch messages for a chat

module.exports = router;
