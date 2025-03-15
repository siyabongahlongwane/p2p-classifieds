module.exports = (sequelize, DataTypes) => {
    const { STRING, INTEGER, BOOLEAN, ENUM, TEXT } = DataTypes;

    const User = sequelize.define('user', {
        user_id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        shop_id: {
            type: INTEGER,
            allowNull: true
        },
        google_id: {
            type: STRING
        },
        first_name: {
            type: STRING,
            allowNull: false
        },
        last_name: {
            type: STRING,
            allowNull: false
        },
        email: {
            type: STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: STRING
        },
        phone: {
            type: STRING
        },
        completed_registration: {
            type: BOOLEAN,
            defaultValue: false
        },
        roles: {
            type: STRING,
            allowNull: false,
            defaultValue: '[3]'
        }
    });

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

    return { User, Chat, Message, ChatParticipant };
};
