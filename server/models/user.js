const sequelize = require('../sequelize')
const { DataTypes } = require('sequelize')

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3]
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3]
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [5, 30]
      }
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        is: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/i
      }
    },
    token: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    avatar: {
      type: DataTypes.TEXT('long')
    },
    supplier: {
      type: DataTypes.STRING
    },
    county: {
      type: DataTypes.STRING
    },
    voltageLevel: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true,
        min: 0
      }
    },
    budget: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true,
        min: 0
      }
    },
    invoiceUnitValue: {
      type: DataTypes.FLOAT,
      validate: {
        isFloat: true,
        min: 0.0
      }
    }
  },
  {
    tableName: 'Users'
  }
)

module.exports = User
