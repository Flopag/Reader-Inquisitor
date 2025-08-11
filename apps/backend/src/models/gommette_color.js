const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('@utils/mysql_connection');

module.exports = sequelize.define('GommetteColor', {
  color: {
    type: DataTypes.STRING(16),
    allowNull: false,
    primaryKey: true,
  },
}, {
  tableName: 'gommette_colors',
  timestamps: false,
});