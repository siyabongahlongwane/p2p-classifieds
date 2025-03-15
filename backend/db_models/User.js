module.exports = (sequelize, DataTypes) => {
    const { STRING, INTEGER, BOOLEAN } = DataTypes;
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

    return User;
};
