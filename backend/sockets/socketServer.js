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
const mail = require('../utils/mail');

const onlineUsers = new Map(); // Store user_id -> socket.id
const pendingMessages = new Map(); // Store user_id -> array of messages

// Handle User Connection
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // **Start a Chat**
    socket.on('startChat', async ({ user1_id, user2_id }, callback) => {
        try {
            console.log(`📨 Received startChat request: user1_id=${user1_id}, user2_id=${user2_id}`);

            // Check if chat already exists
            let chat = await db.models.Chat.findOne({
                where: {
                    [Op.or]: [
                        { user1_id, user2_id },
                        { user1_id: user2_id, user2_id: user1_id }
                    ]
                },
                include: [
                    { model: db.models.User, as: 'user1', attributes: ['user_id', 'first_name', 'last_name', 'email'] },
                    { model: db.models.User, as: 'user2', attributes: ['user_id', 'first_name', 'last_name', 'email'] },
                    {
                        model: db.models.Message,
                        as: 'lastMessage',
                        attributes: ['message_id', 'sender_id', 'message_type', 'content', 'image_url', 'createdAt'],
                        include: [{ model: db.models.User, as: 'sender', attributes: ['first_name', 'last_name'] }]
                    }
                ],
                order: [['updatedAt', 'DESC']]
            });

            if (!chat) {
                console.log('🆕 No existing chat found. Creating new chat...');
                chat = await db.models.Chat.create({ user1_id, user2_id });

                // Fetch users after creation
                chat = await db.models.Chat.findOne({
                    where: { chat_id: chat.chat_id },
                    include: [
                        { model: db.models.User, as: 'user1', attributes: ['user_id', 'first_name', 'last_name', 'email'] },
                        { model: db.models.User, as: 'user2', attributes: ['user_id', 'first_name', 'last_name', 'email'] },
                        {
                            model: db.models.Message,
                            as: 'lastMessage',
                            attributes: ['message_id', 'sender_id', 'message_type', 'content', 'image_url', 'createdAt'],
                            include: [{ model: db.models.User, as: 'sender', attributes: ['first_name', 'last_name'] }]
                        }
                    ],
                    order: [['updatedAt', 'DESC']]
                });
            }

            // ✅ Convert user1 & user2 into an array for easier access
            const users = [chat.user1, chat.user2];

            console.log('✅ Chat response:', chat);
            callback({ success: true, ...chat.toJSON(), users });

        } catch (error) {
            console.error('❌ Error creating chat:', error);
            callback({ success: false, error: 'Database error while creating chat' });
        }
    });



    // Handle User Joining the App (Not Just a Chat)
    socket.on('userOnline', async (user_id) => {
        onlineUsers.set(user_id, socket.id);
        console.log(`User ${user_id} is online`);

        console.log(onlineUsers)
        //  Deliver pending messages if they exist
        if (pendingMessages.has(user_id)) {
            const messages = pendingMessages.get(user_id);
            messages.forEach((msg) => {
                io.to(socket.id).emit('newMessage', msg);
            });
            pendingMessages.delete(user_id); //  Clear stored messages after sending
        }
    });

    // Handle User Joining a Specific Chat
    socket.on('joinChat', async ({ user_id, chat_id }) => {
        console.log(`chat_${chat_id}`)
        socket.join(`chat_${chat_id}`);

        // Fetch user details
        const user = await db.models.User.findOne({
            where: { user_id },
            attributes: ['user_id', 'first_name', 'last_name']
        });

        if (user) {
            console.log(`${user.first_name} joined chat ${chat_id}`);
            io.to(`chat_${chat_id}`).emit('userJoined', user);
        }
    });

    // Handle Sending a Message
    socket.on('sendMessage', async (messageData) => {
        console.log('messageData', messageData)
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

            // Fetch message with sender details
            const savedMessage = await db.models.Message.findOne({
                where: { message_id: newMessage.message_id },
                include: [{ model: db.models.User, as: 'sender', attributes: ['first_name', 'last_name'] }]
            });

            // Get recipient ID
            const chat = await db.models.Chat.findOne({ where: { chat_id } });
            const recipientId = chat.user1_id === sender_id ? chat.user2_id : chat.user1_id;

            //  Check if the recipient is online anywhere in the app
            if (onlineUsers.has(recipientId)) {
                console.log('onlineUsers', recipientId, onlineUsers)
                io.to(onlineUsers.get(recipientId)).emit('newMessage', savedMessage);
            } else {
                const sender = await db.models.User.findOne({ where: { user_id: sender_id }, attributes: ["first_name", "email"] });
                const recipient = await db.models.User.findOne({ where: { user_id: recipientId }, attributes: ["first_name", "email"] });

                // User is offline, send an email notification
                await mail(
                    recipient.email,
                    'New Message Notification',
                    'offline-message',
                    {
                        recipientName: recipient.first_name,
                        senderName: sender.first_name,
                        messageContent: content,
                        chatUrl: `${process.env.CLIENT_URL}/messages/${chat_id}`,
                        year: new Date().getFullYear()
                    }
                );
            }

            // Send to the sender (for optimistic update)
            io.to(onlineUsers.get(sender_id)).emit('newMessage', savedMessage);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });

    // Handle User Disconnection
    socket.on('disconnect', () => {
        for (let [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
        io.emit('onlineUsers', Array.from(onlineUsers.keys()));
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start Server
server.listen(PORT, () => console.log(`Socket.io server running on port ${PORT}`));

module.exports = { io };