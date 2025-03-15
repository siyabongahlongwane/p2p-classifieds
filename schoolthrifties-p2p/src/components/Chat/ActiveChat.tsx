import { useEffect, useRef, useState } from 'react';
import { Avatar, Box, Divider, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useChatStore } from '../../stores/useChatStore';
import ChatBubble from './ChatBubble';
import socket from '../../utils/socket';
import { NewMessage, User } from '../../typings';

const ActiveChat = ({ chat_id, currentUserId }: { chat_id: number; currentUserId: number }) => {
    const { messages, setMessages, addMessage, clearActiveChat } = useChatStore();
    const [message, setMessage] = useState('');
    const chatContainerRef = useRef<HTMLDivElement | null>(null); // Ref for auto-scrolling
    const [otherChatUser, setOtherChatUser] = useState('');

    // Fetch messages on component mount
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/chats/fetch-messages?chat_id=${chat_id}`);
                const data = await response.json();

                if (response.ok) {
                    setMessages(chat_id, data.payload.messages);
                    const otherUser = data.payload.users?.find((user: User) => user.user_id !== currentUserId);
                    setOtherChatUser(otherUser ? `${otherUser.first_name} ${otherUser.last_name}` : '');
                } else {
                    console.error("Error:", data.err);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchMessages();
    }, [chat_id]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages[chat_id]?.length]); // Only scroll when a new message arrives

    // Listen for incoming messages
    useEffect(() => {
        const handleNewMessage = (newMessage: NewMessage) => {
            if (newMessage.chat_id === chat_id) {
                // addMessage(newMessage);
            }
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [chat_id, addMessage]);
    
        // Clear chat state when navigating away
        useEffect(() => {
            return () => {
                // clearActiveChat();
            };
        }, []);
    

    const sendMessage = () => {
        if (!message.trim()) return;

        const newMessage: NewMessage = {
            chat_id,
            sender_id: currentUserId,
            message_type: 'TEXT',
            content: message,
        };

        socket.emit('sendMessage', newMessage);
        // addMessage(newMessage);
        setMessage('');
    };

    return (
        <Paper elevation={3} sx={{ height: '85vh', display: 'flex', flexDirection: 'column' }}>
            {/* Fixed Chat Header */}
            <Box sx={{ p: 2, borderBottom: '1px solid #ddd', background: 'white', zIndex: 10, position: 'sticky', top: 0 }}>
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ width: 40, height: 40 }} />
                    <Box>
                        <Typography fontSize={14} fontWeight={500}>{otherChatUser}</Typography>
                    </Box>
                </Box>
                <Divider />
            </Box>

            {/* Scrollable Messages Container */}
            <Box ref={chatContainerRef} sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                <Stack spacing={1}>
                    {messages[chat_id]?.map((msg) => (
                        <ChatBubble
                            key={msg.message_id}
                            message={msg.content as string}
                            timestamp={msg.createdAt}
                            senderId={msg.sender_id}
                            currentUserId={currentUserId}
                        />
                    ))}
                </Stack>
            </Box>

            {/* Fixed Input at Bottom */}
            <Box display="flex" alignItems="center" p={2} sx={{ borderTop: '1px solid #ddd', position: 'sticky', bottom: 0, background: 'white', zIndex: 10 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <IconButton color="primary" onClick={sendMessage} sx={{ ml: 1 }}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Paper>
    );
};

export default ActiveChat;
