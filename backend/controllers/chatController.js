const { models: { Chat, Message, User } } = require('../db_models');
const { Op } = require('sequelize');

module.exports = {
    /** 
     * Start a chat between two users (Creates or fetches an existing chat)
     */
    startChat: async (req, res) => {
        try {
            const { user1_id, user2_id } = req.body;

            // Check if a chat already exists
            let chat = await Chat.findOne({
                where: {
                    [Op.or]: [
                        { user1_id, user2_id },
                        { user1_id: user2_id, user2_id: user1_id }
                    ]
                },
                include: [{ model: Message, as: 'lastMessage' }]
            });

            // If no chat exists, create a new one
            if (!chat) {
                chat = await Chat.create({ user1_id, user2_id });
            }

            return res.status(200).json({ payload: chat, msg: 'Chat started successfully' });
        } catch (error) {
            return res.status(500).json({ err: error.message });
        }
    },

    /** 
     * Fetch all chats for a user
     */
    fetchChats: async (req, res) => {
        try {
            const { user_id } = req.query;

            const chats = await Chat.findAll({
                where: {
                    [Op.or]: [{ user1_id: user_id }, { user2_id: user_id }]
                },
                include: [
                    {
                        model: Message,
                        as: 'lastMessage',
                        attributes: ['message_id', 'sender_id', 'message_type', 'content', 'image_url', 'createdAt'],
                        include: [{ model: User, as: 'sender', attributes: ['first_name', 'last_name'] }]
                    }
                ],
                order: [['updatedAt', 'DESC']]
            });

            return res.status(200).json({ payload: chats });
        } catch (error) {
            return res.status(500).json({ err: error.message });
        }
    },

    /** 
     * Send a message in an existing chat
     */
    sendMessage: async (req, res) => {
        try {
            const { chat_id, sender_id, message_type, content, image_url } = req.body;

            // Ensure chat exists before sending a message
            const chat = await Chat.findOne({ where: { chat_id } });
            if (!chat) {
                return res.status(404).json({ err: 'Chat not found' });
            }

            // Save the message
            const message = await Message.create({
                chat_id,
                sender_id,
                message_type,
                content,
                image_url
            });

            // Update the chat's last message
            await Chat.update({ last_message_id: message.message_id }, { where: { chat_id } });

            return res.status(201).json({ payload: message, msg: 'Message sent successfully' });
        } catch (error) {
            return res.status(500).json({ err: error.message });
        }
    },

    /** 
     * Fetch messages for a chat
     */
    fetchMessages: async (req, res) => {
        try {
            const { chat_id } = req.query;

            const chat = await Chat.findOne({
                where: { chat_id },
                include: [
                    {
                        model: User,
                        as: 'user1',
                        attributes: ['user_id', 'first_name', 'last_name', 'email']
                    },
                    {
                        model: User,
                        as: 'user2',
                        attributes: ['user_id', 'first_name', 'last_name', 'email']
                    },
                    {
                        model: Message,
                        as: 'messages',
                        include: [{ model: User, as: 'sender', attributes: ['first_name', 'last_name'] }]
                    }
                ],
                order: [['messages', 'createdAt', 'ASC']]
            });

            if (!chat) {
                return res.status(404).json({ err: 'Chat not found' });
            }

            return res.status(200).json({
                payload: {
                    users: [chat.user1, chat.user2], //  Return both users
                    messages: chat.messages
                }
            });
        } catch (error) {
            return res.status(500).json({ err: error.message });
        }
    }
};
