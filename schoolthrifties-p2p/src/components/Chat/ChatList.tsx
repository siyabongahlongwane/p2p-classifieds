import { ListItem, Stack, Typography } from "@mui/material"
import ChatListItem from "./ChatListItem"
import { useChatStore } from "../../stores/useChatStore";
import { useEffect } from "react";
import { useUserStore } from '../../stores/useUserStore';
import { ChatMessage } from "../../typings";


const ChatList = () => {
    const { activeChat, setActiveChat, setChats, chats } = useChatStore();
    const user = useUserStore((state) => state.user);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/chats/fetch-chats?user_id=${user?.user_id}`);
                const data = await response.json();

                if (response.ok) {
                    setChats(data.payload);
                } else {
                    console.error("Error:", data.err);
                }
            } catch (error) {
                console.error("Fetch error:", error);
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