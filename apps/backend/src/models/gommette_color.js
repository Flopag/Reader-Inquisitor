const { Sequelize, DataTypes } = require('sequelize');
const { DataTypes } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');

const GommetteColor = sequelize.define('GommetteColor', {
  color: {
    type: DataTypes.STRING(16),
    allowNull: false,
    primaryKey: true,
  },
}, {
  tableName: 'gommette_colors',
  timestamps: false,
});