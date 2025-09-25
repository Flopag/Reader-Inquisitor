const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('@utils/mysql_connection');

module.exports = sequelize.define('BotLog', {
  bot_logs_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  bot_name: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'bot_names',
      key: 'bot_name',
    },
    onDelete: 'CASCADE',
  },
  assigned_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'bot_logs',
  timestamps: false,
});
