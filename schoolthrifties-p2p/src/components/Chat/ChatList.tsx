import { ListItem, Stack } from "@mui/material"
import ChatListItem from "./ChatListItem"
import { useState } from "react";

const chats = [
    {
        chat_id: 1,
        lastMessage: {
            message_id: 55,
            sender_id: 6,
            message_type: 'TEXT',
            content: 'Hey, are you available?',
            image_url: null,
            createdAt: '2025-03-10T14:32:00.000Z',
            sender: {
                first_name: 'Mighty',
                last_name: 'Shop'
            }
        }
    },
    {
        chat_id: 2,
        lastMessage: {
            message_id: 55,
            sender_id: 6,
            message_type: 'TEXT',
            content: 'Hey, are you available?',
            image_url: null,
            createdAt: '2025-03-10T14:32:00.000Z',
            sender: {
                first_name: 'Mighty',
                last_name: 'Shop'
            }
        }
    },
    {
        chat_id: 3,
        lastMessage: {
            message_id: 55,
            sender_id: 6,
            message_type: 'TEXT',
            content: 'Hey, are you available?',
            image_url: null,
            createdAt: '2025-03-10T14:32:00.000Z',
            sender: {
                first_name: 'Mighty',
                last_name: 'Shop'
            }
        }
    },
    {
        chat_id: 4,
        lastMessage: {
            message_id: 55,
            sender_id: 6,
            message_type: 'TEXT',
            content: 'Hey, are you available?',
            image_url: null,
            createdAt: '2025-03-10T14:32:00.000Z',
            sender: {
                first_name: 'Mighty',
                last_name: 'Shop'
            }
        }
    }
]

const ChatList = () => {
    const [activeChat, setActiveChat] = useState<number>(-1);

    return (
        <Stack>
            {
                chats.map((chat, indx) => {
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