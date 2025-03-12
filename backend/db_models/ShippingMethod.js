module.exports = (sequelize, DataTypes) => {
    const { INTEGER, BOOLEAN, FLOAT, STRING, TEXT } = DataTypes;
    const ShippingSettings = sequelize.define("shipping_method", {
        shipping_method_id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        global_shipping_id: {
            type: INTEGER,
            allowNull: false
        },
        shop_id: {
            type: INTEGER,
            allowNull: false,
            references: {
                model: 'shops',
                key: 'shop_id'
            }
        },
        enabled: {
            type: BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    })

    return ShippingSettings;
}