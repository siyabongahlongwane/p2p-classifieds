import { Avatar, Box, Stack, Typography } from "@mui/material"
import { ChatMessage } from "../../typings";
import { formatDateTime } from "../../utils/date.util";
import { useNavigate } from "react-router-dom";

interface ChatProps {
    chat_id: number;
    lastMessage: ChatMessage;
    activeChat?: boolean;
}
const ChatListItem: React.FC<ChatProps> = ({
    chat_id,
    lastMessage,
    activeChat
}) => {
    const navigate = useNavigate();

    const hoverStyles = {
        backgroundColor: '#016ec0',
        color: '#fff',
        cursor: 'pointer',
        borderRadius: 2,
        '& .time-text, & .message-text': {
            color: '#fff !important'
        },
    };

    const selectChat = () => {
        navigate(`/messages/${chat_id}`)
    }


    return (
        <Stack
            direction="row"
            sx={{
                '&:hover': hoverStyles,
                backgroundColor: activeChat ? '#016ec0' : 'transparent',
                color: activeChat ? '#fff' : 'rgba(0,0,0, 0.8)',
                cursor: 'pointer',
                borderRadius: 2,
                '& .time-text, & .message-text': {
                    color: activeChat ? '#fff' : 'rgba(0,0,0, 0.5)'
                },
            }}
            onClick={selectChat}
        >
            <Box p={1} flex={1} gap={1} display="flex" alignItems="center">
                <Avatar sx={{ width: 40, height: 40 }} />
                <Stack direction={'row'} spacing={2}>
                    <Stack>
                        <Typography
                            component={'strong'}
                            whiteSpace={'nowrap'}
                            overflow={'hidden'}
                            textOverflow={'ellipsis'}
                            maxWidth={250}
                        >{lastMessage?.sender?.first_name} {lastMessage?.sender?.last_name}</Typography>
                        <Typography
                            className="message-text"
                            color="gray"
                            fontSize={14}
                            whiteSpace={'nowrap'}
                            overflow={'hidden'}
                            textOverflow={'ellipsis'}
                            maxWidth={250}
                        >
                            {lastMessage?.content}
                        </Typography>
                    </Stack>
                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                        <Typography
                            className="time-text"
                            color="rgba(0,0,0, 0.5)"
                            fontSize={10}
                        >
                            {formatDateTime(lastMessage?.createdAt || '')}
                        </Typography>
                    </Box>
                </Stack>
            </Box>
        </Stack>
    )
}

export default ChatListItem