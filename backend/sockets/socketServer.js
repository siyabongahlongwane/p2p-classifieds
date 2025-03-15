require('dotenv').config();
const { Server } = require('socket.io');
const http = require('http');

const { app, PORT, db } = require('../app');
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Adjust for security in production
        methods: ['GET', 'POST']
    }
});
const { Op } = require('sequelize');
// Store active users
const onlineUsers = new Map();

// Socket.io Connection
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // **Handle User Joining (Save Online Status)**
    socket.on('join', (userId) => {
        onlineUsers.set(userId, socket.id);
        io.emit('onlineUsers', Array.from(onlineUsers.keys())); // Broadcast online users
        console.log(`User ${userId} is online`);
    });

    // **Start a Chat**
    socket.on('startChat', async ({ user1_id, user2_id }, callback) => {
        try {
            console.log({ user1_id, user2_id })
            // Check if a chat already exists
            let chat = await db.models.Chat.findOne({
                where: {
                    [Op.or]: [
                        { user1_id, user2_id },
                        { user1_id: user2_id, user2_id: user1_id }
                    ]
                },
                include: [{ model: db.models.Message, as: 'lastMessage' }]
            });

            // If no chat exists, create a new one
            if (!chat) {
                chat = await db.models.Chat.create({ user1_id, user2_id });
            }

            // Send the chat details back to the client
            callback(chat);
        } catch (error) {
            console.error('Error starting chat:', error);
        }
    });

    // **Handle Sending a Message**
    socket.on('sendMessage', async (messageData) => {
        try {
            const { chat_id, sender_id, message_type, content, image_url } = messageData;

            // Save message to DB
            const newMessage = await db.models.Message.create({
                chat_id,
                sender_id,
                message_type,
                content,
                image_url
            });

            // Update last message in Chat
            await db.models.Chat.update(
                { last_message_id: newMessage.message_id },
                { where: { chat_id } }
            );

            // Fetch complete message with sender details
            const savedMessage = await db.models.Message.findOne({
                where: { message_id: newMessage.message_id },
                include: [{ model: db.models.User, as: 'sender', attributes: ['first_name', 'last_name'] }]
            });

            // Send message to both users in chat
            io.to(onlineUsers.get(sender_id)).emit('newMessage', savedMessage);

            // Send to the other user
            const chat = await db.models.Chat.findOne({ where: { chat_id } });
            const recipientId = chat.user1_id === sender_id ? chat.user2_id : chat.user1_id;

            if (onlineUsers.has(recipientId)) {
                io.to(onlineUsers.get(recipientId)).emit('newMessage', savedMessage);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });

    // **Handle User Disconnecting**
    socket.on('disconnect', () => {
        for (let [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
        io.emit('onlineUsers', Array.from(onlineUsers.keys())); // Broadcast updated list
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start Server
server.listen(PORT, () => console.log(`Socket.io server running on port ${PORT}`));

module.exports = { io };