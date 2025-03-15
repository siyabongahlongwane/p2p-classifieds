import { ListItem, Stack } from "@mui/material"
import ChatListItem from "./ChatListItem"
import { useChatStore } from "../../stores/useChatStore";
import { useContext, useEffect } from "react";
import { UserContext } from "../../context/User/UserContext";


const ChatList = () => {
    const { activeChat, setActiveChat, setChats, chats } = useChatStore();
    const { user: { user_id } } = useContext(UserContext);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/chats/fetch-chats?user_id=${user_id}`);
                const data = await response.json();

                if (response.ok) {
                    console.log("Messages:", data.payload);
                    setChats(data.payload);
                } else {
                    console.error("Error:", data.err);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchChats();
    }, [setChats, user_id])

    return (
        <Stack>
            {
                chats && chats?.map((chat, indx) => {
                    return (
                        <ListItem key={indx} onClick={() => setActiveChat(chat.chat_id)}>
                            <ChatListItem chat_id={chat.chat_id} lastMessage={chat.lastMessage} activeChat={activeChat === chat.chat_id} />
                        </ListItem>
                    )
                })
            }
            <ListItem>

            </ListItem>
        </Stack>
    )
}

export default ChatList