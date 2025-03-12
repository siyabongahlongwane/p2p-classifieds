module.exports = (sequelize, DataTypes) => {
    const { INTEGER, DECIMAL } = DataTypes;
    const Wallet = sequelize.define('wallet', {
        wallet_id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id'
            }
        },
        amount: {
            type: DECIMAL(10, 2), // DECIMAL type with precision 10 and scale 2
            defaultValue: 0.00,
            allowNull: false
        },
    });

    return Wallet;
};
