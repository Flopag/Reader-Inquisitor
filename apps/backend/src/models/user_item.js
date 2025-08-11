const { Sequelize, DataTypes } = require('sequelize');
const { DataTypes } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');

const UserItem = sequelize.define('UserItem', {
  user_item_id: {
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
  shop_item_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'shop_items',
      key: 'item_id',
    },
    onDelete: 'CASCADE',
  },
  obtained_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  expire_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
  used_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
}, {
  tableName: 'user_items',
  timestamps: false,
});
