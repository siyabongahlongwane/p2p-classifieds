module.exports = (sequelize, DataTypes) => {
    const { INTEGER, STRING } = DataTypes;
    const ProductPhoto = sequelize.define('product_photo', {
        photo_id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        product_id: {
            type: INTEGER,
            allowNull: false,
            references: {
                model: 'products',
                key: 'product_id'
            }
        },
        photo_url: {
            type: STRING,
            allowNull: false
        },
    });

    return ProductPhoto;
};
