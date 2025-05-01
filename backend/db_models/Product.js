module.exports = (sequelize, DataTypes) => {
    const { STRING, INTEGER, TEXT, DATE, NOW, ENUM, DECIMAL } = DataTypes;
    const Product = sequelize.define('product', {
        product_id: {
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
        shop_id: {
            type: INTEGER,
            allowNull: false,
            references: {
                model: 'shops',
                key: 'shop_id'
            }
        },
        title: {
            type: STRING(255),
            allowNull: false,
        },
        description: {
            type: TEXT,
            allowNull: true,
        },
        price: {
            type: DECIMAL(10, 2),
            allowNull: false,
        },
        seller_gain: {
            type: DECIMAL(10, 2),
            allowNull: false,
        },
        condition: {
            type: ENUM('New', 'Used', 'Good', 'Well Worn', 'Other'),
            allowNull: false,
        },
        category_id: {
            type: INTEGER,
            allowNull: false,
            references: {
                model: 'categories',
                key: 'category_id'
            }
        },
        location: {
            type: STRING(100),
            allowNull: true,
        },
        province: {
            type: STRING(30),
            allowNull: true,
        },
        status: {
            type: ENUM('Available', 'Sold', 'Unpublished'),
            allowNull: false,
            defaultValue: 'Available',
        },
        shoe_size: {
            type: STRING(10),
            allowNull: true,
            defaultValue: null
        },
        child_age: {
            type: STRING(10),
            allowNull: true,
            defaultValue: null
        },
        gender: {
            type: STRING(30),
            allowNull: true,
            defaultValue: 'Unisex'
        }
    });

    return Product;
};
