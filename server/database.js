const Sequelize = require("sequelize");

const user = 'postgres'
const password = 'postgres'
const host = 'localhost'
const database = 'nextbnb'

const sequelize = new Sequelize(database, user, password, {
  host,
  dialect: 'postgres',
  logging: false
})

module.exports = sequelize