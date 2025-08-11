const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('@utils/mysql_connection');

module.exports = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  discord_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    unique: true,
  },
  role_name: {
    type: DataTypes.STRING(16),
    allowNull: true,
    references: {
      model: 'roles',
      key: 'role_name',
    },
    onDelete: 'SET NULL',
  },
}, {
  tableName: 'users',
  timestamps: false,
});