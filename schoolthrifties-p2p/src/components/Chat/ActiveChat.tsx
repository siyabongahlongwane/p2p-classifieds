import { Avatar, Box, Divider, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useChatStore } from '../../stores/useChatStore';
import ChatBubble from './ChatBubble';

const ActiveChat = ({ chat_id, user_id }: { chat_id: number, user_id: number }) => {
    const { setMessages, setActiveChatUsers, activeChatUsers, messages } = useChatStore();
    const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
    const socketRef = useRef<ReturnType<typeof io> | null>(null);

    useEffect(() => {
        const fetchChatDetails = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/chats/fetch-messages?chat_id=${chat_id}`);
                const data = await response.json();

                if (response.ok) {
                    console.log("Chat Data:", data.payload);

                    setActiveChatUsers(data.payload.users); // ✅ Store both users
                    setMessages(chat_id, data.payload.messages);
                } else {
                    console.error("Error:", data.err);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchChatDetails();
    }, [chat_id]);

    // Initialize Socket
    useEffect(() => {
        const _socket = io(`http://localhost:5001`);

        setSocket(_socket);
        socketRef.current = _socket;

        return () => {
            _socket.disconnect();
        };
    }, []);

    // Display chat users
    const getChatUserName = () => {
        if (!activeChatUsers) return "Loading...";

        return `${activeChatUsers[0].first_name} ${activeChatUsers[0].last_name}`;
    };

    return (
        <Paper elevation={3} sx={{ height: '85vh' }}>
            <Stack flexDirection={'column'} gap={2} p={2}>
                <Box display='flex' flexDirection='row' justifyContent='start' alignItems='center' height='100%' gap={2}>
                    <Avatar sx={{ width: 40, height: 40 }} />
                    <Box display='flex' flexDirection='column'>
                        <Box display='flex' flexDirection='column' alignItems='start'>
                            <Typography fontSize={14} fontWeight={500}>
                                {getChatUserName()}
                            </Typography>
                            <Typography fontSize={12} fontWeight={400}>Shop Name</Typography>
                        </Box>
                    </Box>
                </Box>
                <Divider />
                <Box display='flex' flexDirection='column' gap={1} height='100%' overflow={'auto'}>
                    {messages[chat_id]?.map((msg) => (
                        <ChatBubble
                            key={msg.message_id}
                            message={msg.content as string}
                            timestamp={msg.createdAt}
                            senderId={msg.sender_id}
                            currentUserId={user_id}
                        />
                    ))}
                </Box>
            </Stack>
        </Paper>
    );
}

export default ActiveChat;
