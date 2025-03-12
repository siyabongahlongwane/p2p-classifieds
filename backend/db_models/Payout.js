
module.exports = (sequelize, DataTypes) => {
    const { DECIMAL, INTEGER, ENUM, DATE, STRING } = DataTypes;

    const Payout = sequelize.define('payout', {
        payout_id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
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
            allowNull: false
        },
        amount: {
            type: DECIMAL(10, 2), // DECIMAL type with precision 10 and scale 2
            allowNull: false,
        },
        status: {
            type: ENUM('Pending Payment', 'Invalid', 'Cancelled', 'Paid'),
            allowNull: false,
            defaultValue: 'Pending Payment'
        },
        bank_name: {
            type: STRING,
            allowNull: false
        },
        account_holder: {
            type: STRING,
            allowNull: false
        },
        account_number: {
            type: STRING,
            allowNull: false
        },
        datePaid: {
            type: DATE,
            allowNull: true,
            defaultValue: null,
        }
    })

    return Payout;
}