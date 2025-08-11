const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('@utils/mysql_connection');

module.exports = sequelize.define('Role', {
  role_name: {
    type: DataTypes.STRING(16),
    allowNull: false,
    primaryKey: true,
  },
}, {
  tableName: 'roles',
  timestamps: false,
});