const { Sequelize, DataTypes } = require('sequelize');
const { DataTypes } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');

const Book = sequelize.define('Book', {
  book_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  book_name: {
    type: DataTypes.STRING(512),
    allowNull: false,
  },
  book_reference_url: {
    type: DataTypes.STRING(2048),
    allowNull: true,
    defaultValue: null,
  },
}, {
  tableName: 'books',
  timestamps: false,
});