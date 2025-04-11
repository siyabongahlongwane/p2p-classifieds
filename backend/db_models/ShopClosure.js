module.exports = (sequelize, DataTypes) => {
    const ShopClosure = sequelize.define('shop_closure', {
      shop_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      }
    }, {
      tableName: 'shop_closures',
      timestamps: true,
    });
  
    return ShopClosure;
  };
  