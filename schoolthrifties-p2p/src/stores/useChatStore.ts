import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import socket from '../utils/socket';
import { Chat, ChatMessage } from '../typings';

type MessageType = 'TEXT' | 'IMAGE';


interface ChatStore {
    chats: Chat[] | null;
    messages: Record<number, ChatMessage[]>; // Store messages per chat_id
    activeChat: number | null;
    startChat: (user1_id: number, user2_id: number) => Promise<Chat>;
    addChat: (chat: Chat) => void;
    addMessage: (message: any) => void;
    setChats: (chats: Chat[]) => void;
    setMessages: (chatId: number, messages: ChatMessage[]) => void;
    setActiveChat: (chatId: number) => void;
    activeChatUsers: { user_id: number; first_name: string; last_name: string; email: string }[] | null;
    setActiveChatUsers: (users: { user_id: number; first_name: string; last_name: string; email: string }[]) => void;
    clearActiveChat: () => void;
}

export const useChatStore = create<ChatStore>()(
    devtools((set) => ({
        chats: [],
        messages: {},
        activeChat: null,
        activeChatUsers: null,

        setActiveChatUsers: (users) => set({ activeChatUsers: users }, false, "setActiveChatUsers"),

        setActiveChat: (chatId) => set({ activeChat: chatId }, false, "setActiveChat"),

        // Start a chat (creates or fetches an existing chat)
        startChat: async (user1_id, user2_id) => {
            console.log('chat', user1_id, user2_id);
            return new Promise((resolve) => {
                socket.emit('startChat', { user1_id, user2_id }, (chat: Chat) => {
                    set((state) => ({
                        chats: [...state.chats || [], chat],
                        activeChat: chat.chat_id,
                    }), false, "startChat");


                    resolve(chat);
                });
            });
        },

        // Add a new chat
        addChat: (chat) =>
            set((state) => ({
                chats: [...state.chats || [], chat],
            }), false, "addChat"),

        //  Fix: Add a message and update the last message in chat
        addMessage: (message) =>
            set((state) => {
                // ✅ Prevent duplicate messages
                console.log({ message });
                if (state.messages[message.chat_id]?.some((msg) => msg.message_id === message.message_id)) {
                    console.warn("⚠️ Duplicate message detected, ignoring:", message);
                    return state;
                }

                const updatedChats = state.chats?.map((chat) =>
                    chat.chat_id === message.chat_id ? { ...chat, lastMessage: message } : chat
                ) || [];

                return {
                    chats: updatedChats,
                    messages: {
                        ...state.messages,
                        [message.chat_id]: [
                            ...(state.messages[message.chat_id] || []),
                            message?.message_id && message,
                        ].filter(chat => chat?.message_id),
                    },
                };
            }, false, "addMessage"),

        // Set initial chat list
        setChats: (chats) => set({ chats }, false, "setChats"),

        // Set initial messages for a chat
        setMessages: (chatId, messages) =>
            set((state) => ({
                messages: { ...state.messages, [chatId]: messages },
            }), false, "setMessages"),

        // Clear active chat when navigating away
        clearActiveChat: () =>
            set({ activeChat: null, activeChatUsers: null, messages: {} }, false, "clearActiveChat"),
    }), { name: "ChatStore" })
);

// Listen for `newMessage` globally and update Zustand state
socket.on("newMessage", (message: ChatMessage) => {
    useChatStore.getState().addMessage(message);
});
