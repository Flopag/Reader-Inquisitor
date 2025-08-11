const { Sequelize, DataTypes } = require('sequelize');
const { DataTypes } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');

const Currency = sequelize.define('Currency', {
  currency_name: {
    type: DataTypes.STRING(32),
    allowNull: false,
    primaryKey: true,
  },
}, {
  tableName: 'currencies',
  timestamps: false,
});
