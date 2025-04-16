import { ListItem, Stack, Typography } from "@mui/material"
import ChatListItem from "./ChatListItem"
import { useChatStore } from "../../stores/useChatStore";
import { useEffect } from "react";
import { useUserStore } from '../../stores/useUserStore';
import { ChatMessage } from "../../typings";
import useApi from "../../hooks/useApi";
import useToastStore from "../../stores/useToastStore";


const ChatList = () => {
    const { activeChat, setActiveChat, setChats, chats } = useChatStore();
    const user = useUserStore((state) => state.user);
    const { showToast } = useToastStore();

    const { get, error } = useApi(`${import.meta.env.VITE_API_URL}`);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await get(`/chats/fetch-chats`);

                if (!response){
                    throw new Error(error);
                } 
                setChats(response);
            } catch (error: any) {
                console.error("Fetch error:", error.message);
                showToast(`Error fetching chats: ${error.message}`, 'error', 5000);
            }
        };

        fetchChats();
    }, [setChats, user?.user_id])

    return (
        <Stack>
            {
                chats?.length === 0
                    ?
                    <Typography variant="body1" color={"gray"}>No Chats Found</Typography>
                    :
                    chats && chats?.map((chat, indx) => {
                        return (
                            <ListItem key={indx} onClick={() => setActiveChat(chat.chat_id)}>
                                <ChatListItem chat_id={chat.chat_id} lastMessage={chat.lastMessage as ChatMessage} activeChat={activeChat === chat.chat_id} currentUser={user?.user_id as number} users={chat.users} />
                            </ListItem>
                        )
                    })
            }
        </Stack>
    )
}

export default ChatList