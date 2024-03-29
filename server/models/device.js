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
    energyConsumption: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0
      }
    },
    unitMeasurement: {
      type: DataTypes.STRING,
      allowNull: false
    },
    noOperatingHours: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true,
        min: 0.0
      }
    },
    efficiencyClass: {
      type: DataTypes.ENUM('A+++', 'A++', 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G', '')
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3]
      }
    },
    previousVersion: {
      type: DataTypes.TEXT
    }
  },
  {
    tableName: 'Devices'
  }
)

module.exports = Device
