import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import io from 'socket.io-client';

const socket = io(`http://localhost:5001`, {
    // transports: ['websocket', 'polling'],
    //   auth: { token: access_token },
    //   query: { documentId }
});
type MessageType = 'TEXT' | 'IMAGE';

interface ChatMessage {
    message_id: number;
    chat_id: number;
    sender_id: number;
    message_type: MessageType;
    content: string | null;
    image_url: string | null;
    createdAt: string;
    sender: {
        first_name: string;
        last_name: string;
    };
}

interface Chat {
    chat_id: number;
    user1_id: number;
    user2_id: number;
    lastMessage: ChatMessage;
}

interface ChatStore {
    chats: Chat[] | null;
    messages: Record<number, ChatMessage[]>; // Store messages per chat_id
    activeChat: number | null;
    startChat: (user1_id: number, user2_id: number) => Promise<Chat>;
    addChat: (chat: Chat) => void;
    addMessage: (message: ChatMessage) => void;
    setChats: (chats: Chat[]) => void;
    setMessages: (chatId: number, messages: ChatMessage[]) => void;
    setActiveChat: (chatId: number) => void;
    activeChatUsers: { user_id: number; first_name: string; last_name: string; email: string }[] | null;
    setActiveChatUsers: (users: { user_id: number; first_name: string; last_name: string; email: string }[]) => void;
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
            return new Promise((resolve) => {
                socket.emit('startChat', { user1_id, user2_id }, (chat: Chat) => {
                    set((state) => ({
                        chats: [...state.chats, chat],
                        activeChat: chat.chat_id,
                    }), false, "startChat");

                    resolve(chat);
                });
            });
        },

        // Add a new chat
        addChat: (chat) =>
            set((state) => ({
                chats: [...state.chats, chat],
            }), false, "addChat"),

        // Add a message and update the last message in chat
        addMessage: (message) =>
            set((state) => {
                const updatedChats = state.chats.map((chat) =>
                    chat.chat_id === message.chat_id ? { ...chat, lastMessage: message } : chat
                );

                return {
                    chats: updatedChats,
                    messages: {
                        ...state.messages,
                        [message.chat_id]: [...(state.messages[message.chat_id] || []), message],
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
    }), { name: "ChatStore" })
);
