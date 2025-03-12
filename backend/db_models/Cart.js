module.exports = (sequelize, DataTypes) => {
    const { INTEGER } = DataTypes;
    const Cart = sequelize.define('cart_item', {
        cart_item_id: {
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

    return Cart;
};
