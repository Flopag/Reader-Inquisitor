const { Sequelize, DataTypes } = require('sequelize');
const { DataTypes } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');

const UserGommette = sequelize.define('UserGommette', {
  gommette_id: {
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
  assigned_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  gommette_color: {
    type: DataTypes.STRING(16),
    allowNull: false,
    references: {
      model: 'gommette_colors',
      key: 'color',
    },
    onDelete: 'CASCADE',
  },
  gommette_book_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: 'books',
      key: 'book_id',
    },
    onDelete: 'SET NULL',
  },
}, {
  tableName: 'user_gommettes',
  timestamps: false,
});
