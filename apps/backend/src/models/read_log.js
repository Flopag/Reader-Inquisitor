const { Sequelize, DataTypes } = require('sequelize');
const { DataTypes } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');

const ReadLog = sequelize.define('ReadLog', {
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'user_id',
    },
    onDelete: 'CASCADE',
  },
  logged_at: {
    type: DataTypes.DATE,
    allowNull: false,
    primaryKey: true,
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
