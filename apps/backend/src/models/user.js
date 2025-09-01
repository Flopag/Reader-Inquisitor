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
  user_url: {
    type: DataTypes.STRING(2048),
    allowNull: true,
    defaultValue: null,
  },
}, {
  tableName: 'users',
  timestamps: false,
});