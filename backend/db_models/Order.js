module.exports = (sequelize, DataTypes) => {
    const { INTEGER, DECIMAL, ENUM, DATE, NOW, STRING, BOOLEAN } = DataTypes;

    const Order = sequelize.define('order', {
        order_id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id',
            },
        },
        shop_id: {
            type: INTEGER,
            allowNull: false,
            references: {
                model: 'shops',
                key: 'shop_id'
            },
        },
        status: {
            type: ENUM('Pending Payment', 'Paid', 'Shipped', 'Received By Buyer', 'Cancelled'),
            allowNull: false,
            defaultValue: 'Pending Payment',
        },
        total_price: {
            type: DECIMAL(10, 2),
            allowNull: false,
        },
        non_discounted_price: {
            type: DECIMAL(10, 2),
            allowNull: false,
        },
        delivery_cost: {
            type: DECIMAL(10, 2),
            defaultValue: 0
        },
        province: {
            type: STRING,
            allowNull: false,
        },
        pudo_locker_location: {
            type: STRING,
            allowNull: false,
        },
        phone_number: {
            type: STRING,
            allowNull: false,
        },
        payment_option: {
            type: STRING,
            allowNull: false,
        },
        shipping_method: {
            type: STRING,
            allowNull: false,
        },
        isPaid: {
            type: BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        isPaid: {
            type: BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        datePaid: {
            type: DATE,
            allowNull: true,
            defaultValue: null,
        },
        seller_gain: {
            type: DECIMAL(10, 2),
            allowNull: false,
        },
        created_at: {
            type: DATE,
            allowNull: false,
            defaultValue: NOW,
        },
        updated_at: {
            type: DATE,
            allowNull: false,
            defaultValue: NOW,
        },
    }, {
        timestamps: false,
        underscored: true,
    });

    return Order;
};
