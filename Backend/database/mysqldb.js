const Sequelize = require('sequelize');

const db = new Sequelize('db_bank', 'root', 'kai', {
    host: 'localhost',
    dialect: 'mysql',
    port: '3306',
    logging: false,
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = db;

