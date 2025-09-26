const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('@utils/mysql_connection');

module.exports = sequelize.define('BotName', {
  bot_name: {
    type: DataTypes.STRING(32),
    allowNull: false,
    primaryKey: true,
  },
}, {
  tableName: 'bot_names',
  timestamps: false,
});