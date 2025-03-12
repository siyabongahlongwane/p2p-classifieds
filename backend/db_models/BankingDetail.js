module.exports = (sequelize, DataTypes) => {
    const { INTEGER, STRING } = DataTypes;
    const BankingDetail = sequelize.define('banking_detail', {
        banking_details_id: {
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
        name: {
            type: STRING,
            allowNull: true
        },
        account_number: {
            type: STRING,
            allowNull: true
        },
        account_holder: {
            type: STRING,
            allowNull: true
        },
        account_type: {
            type: STRING,
            allowNull: true
        },
    });

    return BankingDetail;
};
