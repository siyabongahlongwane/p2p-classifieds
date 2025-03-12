module.exports = (sequelize, DataTypes) => {
    const { STRING, INTEGER } = DataTypes;
    const Category = sequelize.define('category', {
        category_id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: STRING(255),
            allowNull: false,
        },
    });

    return Category;
};
