import { Box, Paper, Typography } from '@mui/material';
import { formatDateTime } from '../../utils/date.util';

interface ChatBubbleProps {
    message: string;
    timestamp: string;
    senderId: number;
    currentUserId: number;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, timestamp, senderId, currentUserId }) => {
    const isSender = senderId === currentUserId;

    return (
        <Box
            display="flex"
            justifyContent={isSender ? 'flex-end' : 'flex-start'}
            my={1}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 1.5,
                    maxWidth: '60%',
                    backgroundColor: isSender ? '#005d87' : '#f0f0f0',
                    color: isSender ? 'white' : 'black',
                    borderRadius: isSender ? '15px 15px 0px 15px' : '15px 15px 15px 0px',
                }}
            >
                <Typography fontSize={14}>{message}</Typography>
                <Typography fontSize={12} sx={{ opacity: 0.7, textAlign: 'right', mt: 0.5 }}>
                    {formatDateTime(timestamp)}
                </Typography>
            </Paper>
        </Box>
    );
};

export default ChatBubble;
