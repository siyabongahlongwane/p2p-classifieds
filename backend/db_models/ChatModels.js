module.exports = (sequelize, DataTypes) => {
    const { STRING, INTEGER, BOOLEAN, ENUM, TEXT } = DataTypes;

    const Chat = sequelize.define('chat', {
        chat_id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        user1_id: { type: INTEGER, allowNull: false },
        user2_id: { type: INTEGER, allowNull: false },
        last_message_id: { type: INTEGER, allowNull: true } // Track last message
    });

    const Message = sequelize.define('message', {
        message_id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        chat_id: { type: INTEGER, allowNull: false },
        sender_id: { type: INTEGER, allowNull: false },
        message_type: { type: ENUM('TEXT', 'IMAGE'), allowNull: false },
        content: { type: TEXT, allowNull: true },
        image_url: { type: STRING, allowNull: true }
    });

    const ChatParticipant = sequelize.define('chat_participant', {
        participant_id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        chat_id: { type: INTEGER, allowNull: false },
        user_id: { type: INTEGER, allowNull: false }
    });

    return { Chat, Message, ChatParticipant };
};
