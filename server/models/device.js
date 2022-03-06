const sequelize = require('../sequelize')
const { DataTypes } = require('sequelize')

const Device = sequelize.define(
  'Device',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    consumption: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true,
        min: 0.0
      }
    },
    noWorkingHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0
      }
    },
    energyClass: {
      type: DataTypes.ENUM('A', 'B', 'C', 'D', 'E', 'F', 'G'),
      allowNull: false
    },
    deviceType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3]
      }
    }
  },
  {
    tableName: 'Devices'
  }
)

module.exports = Device
