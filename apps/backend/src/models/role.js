const { Sequelize, DataTypes } = require('sequelize');
const { DataTypes } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');

const Role = sequelize.define('Role', {
  role_name: {
    type: DataTypes.STRING(16),
    allowNull: false,
    primaryKey: true,
  },
}, {
  tableName: 'roles',
  timestamps: false,
});