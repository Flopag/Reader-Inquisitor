const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('@utils/mysql_connection');

module.exports = sequelize.define('ReadLog', {
  read_log_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id',
    },
    onDelete: 'CASCADE',
  },
  logged_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  completion: {
    type: DataTypes.TINYINT,
    allowNull: false,
    validate: {
      max: 100,
      min: 0,
    },
  },
  book_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'books',
      key: 'book_id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'read_logs',
  timestamps: false,
});
