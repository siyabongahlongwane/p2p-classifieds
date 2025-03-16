import { MessageOutlined } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'
import { useChatStore } from '../../stores/useChatStore'
import { useContext } from 'react'
import { UserContext } from '../../context/User/UserContext'
import useToastStore from '../../stores/useToastStore'
import { useNavigate } from 'react-router-dom'

interface ChatProps {
    text?: string,
    user2_id: number
}
const StartChat = ({ text, user2_id }: ChatProps) => {
    const { startChat, setActiveChat, setActiveChatUsers } = useChatStore();
    const { user: { user_id: user1_id } } = useContext(UserContext);
    const { showToast } = useToastStore();
    const navigate = useNavigate();

    const handleStartChat = async () => {
        try {
            console.log(user1_id, user2_id)
            const { chat_id, users } = await startChat(user1_id, user2_id);
            console.log('startChat', chat_id)
            if (!chat_id) throw new Error('Error starting chat');

            showToast('Chat started successfully', 'success');
            setActiveChatUsers(users);
            setActiveChat(chat_id);
            
            setTimeout(() => {
                navigate(`/messages/${chat_id}`);
            }, 500);
        } catch (error) {
            console.error('Error starting chat', error);
            showToast('Error starting chat', 'error');
        }
    }
    return (
        <Stack direction="column" spacing={1} alignItems="center" onClick={handleStartChat}>
            <MessageOutlined htmlColor="var(--blue)" />
            <Typography variant="subtitle2" component="small" fontSize={12} color="gray" fontWeight={300} >Message {text}</Typography>
        </Stack>
    )
}

export default StartChat