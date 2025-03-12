
module.exports = (sequelize, DataTypes) => {
    const { STRING, INTEGER, TEXT } = DataTypes;

    const Shop = sequelize.define('shop', {
        shop_id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_id: {
            type: INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id'
            }
        },
        name: {
            type: STRING(255),
            allowNull: false,
        },
        link: {
            type: STRING(255),
            allowNull: true,
        },
        location: {
            type: TEXT,
            allowNull: true,
        },
    })

    return Shop;
}