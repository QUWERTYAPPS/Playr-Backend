require('dotenv').config();
const Sequelize = require('sequelize')

const sequelize = new Sequelize(
    process.env.DATABASE, 
    process.env.DB_USERNAME, 
    process.env.DB_PASSWORD,
    {
        dialect:process.env.DB_DIALECT, 
        host:process.env.DB_HOST
    })

module.exports = sequelize


