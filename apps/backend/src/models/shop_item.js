const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('@utils/mysql_connection');

module.exports = sequelize.define('ShopItem', {
  item_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  item_name: {
    type: DataTypes.STRING(32),
    allowNull: false,
  },
  item_cost_currency_name: {
    type: DataTypes.STRING(32),
    allowNull: false,
    references: {
      model: 'currencies',
      key: 'currency_name',
    },
    onDelete: 'CASCADE',
  },
  item_cost_amount: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  is_punishment: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  tableName: 'shop_items',
  timestamps: false,
});
