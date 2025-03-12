module.exports = (sequelize, DataTypes) => {
    const { INTEGER, DATE, NOW, ENUM, DECIMAL } = DataTypes;
    const Product = sequelize.define('product', {
        transaction_id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        buyer_id: {
            type: INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id'
            }
        },
        seller_id: {
            type: INTEGER,
            allowNull: false,
            references: {
                model: 'shops',
                key: 'shop_id'
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
        amount: {
            type: DECIMAL(10, 2),
            allowNull: false
        },
        transaction_date: {
            type: DATE,
            defaultValue: NOW
        },
        status: {
            type: ENUM('Pending', 'Completed', 'Cancelled'),
            allowNull: false,
            defaultValue: 'Pending'
        },
        payment_method: {
            type: ENUM('Cash', 'Card', 'Other'),
            allowNull: false
        }
    });

    return Product;
};
