module.exports = (sequelize, DataTypes) => {
    const { INTEGER } = DataTypes;
    const Like = sequelize.define('like_item', {
        like_id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id'
            }
        },
        product_id: {
            type: INTEGER,
            allowNull: false,
            references: {
                model: 'products',
                key: 'product_id'
            }
        },
    });

    return Like;
};
