module.exports = (sequelize, DataTypes) => {
    const { INTEGER, DECIMAL } = DataTypes;

    const OrderItem = sequelize.define('order_item', {
        order_item_id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        order_id: {
            type: INTEGER,
            allowNull: false,
            references: {
                model: 'orders',
                key: 'order_id',
            },
        },
        product_id: {
            type: INTEGER,
            allowNull: false,
            references: {
                model: 'products',
                key: 'product_id',
            },
        },
        price: {
            type: DECIMAL(10, 2),
            allowNull: false,
        },
    }, {
        timestamps: false,
        underscored: true,
    });

    return OrderItem;
};
