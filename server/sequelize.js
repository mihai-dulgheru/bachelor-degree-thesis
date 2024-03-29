const { Sequelize } = require('sequelize')
const { config } = require('dotenv')
config({})

let sequelize
if (process.env.MODE === 'development') {
  sequelize = new Sequelize('database_bachelor_degree_thesis', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: false
    }
  })
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  })
}

module.exports = sequelize
