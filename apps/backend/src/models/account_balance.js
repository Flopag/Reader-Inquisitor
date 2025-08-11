const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('@utils/mysql_connection');

module.exports = sequelize.define('AccountBalance', {
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'user_id',
    },
    onDelete: 'CASCADE',
  },
  account_currency_name: {
    type: DataTypes.STRING(32),
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'currencies',
      key: 'currency_name',
    },
    onDelete: 'CASCADE',
  },
  amount: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
}, {
  tableName: 'account_balances',
  timestamps: false,
});
