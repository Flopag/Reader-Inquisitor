const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('@utils/mysql_connection');

module.exports = sequelize.define('Transaction', {
  transaction_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id',
    },
    onDelete: 'CASCADE',
  },
  account_currency_name: {
    type: DataTypes.STRING(32),
    allowNull: false,
    references: {
      model: 'currencies',
      key: 'currency_name',
    },
    onDelete: 'CASCADE',
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'transactions',
  timestamps: false,
});
