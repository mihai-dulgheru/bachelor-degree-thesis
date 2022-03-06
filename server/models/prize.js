const sequelize = require('../sequelize')
const { DataTypes } = require('sequelize')

const Prize = sequelize.define(
  'Prize',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    prizeType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3]
      }
    },
    prizeValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true,
        min: 0.0
      }
    }
  },
  {
    tableName: 'Prizes'
  }
)

module.exports = Prize
