const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('@utils/mysql_connection');

module.exports = sequelize.define('Currency', {
  currency_name: {
    type: DataTypes.STRING(32),
    allowNull: false,
    primaryKey: true,
  },
}, {
  tableName: 'currencies',
  timestamps: false,
});
