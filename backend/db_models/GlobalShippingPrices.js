module.exports = (sequelize, DataTypes) => {
    const { INTEGER, BOOLEAN, FLOAT, STRING, TEXT } = DataTypes;
    const GlobalShippingPrice = sequelize.define("global_shipping_price", {
        global_shipping_id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: STRING,
            allowNull: false,
        },
        price: {
            type: FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        description: {
            type: TEXT,
            allowNull: true,
        },
        enabled: {
            type: BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    })

    return GlobalShippingPrice;
}