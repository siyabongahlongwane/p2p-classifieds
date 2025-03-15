export type ChatMessage = {
    message_id: number;
    sender_id: number;
    message_type: string;
    content: string | null;
    image_url: string | null;
    createdAt: string; // ISO timestamp
    sender: {
        first_name: string;
        last_name: string;
    };
};

export type Chat = {
    chat_id: number;
    user1_id: number;
    user2_id: number;
    lastMessage: ChatMessage;
};