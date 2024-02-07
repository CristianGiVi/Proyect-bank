const Sequalize = require('sequelize');

const db = new Sequalize( 'db_bank', 'root', '',
    {
        host:'localhost',
        dialect: 'mysql',
        port: '3306',
        logging: false,
        define:{
            timestamps: false
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

module.exports = db;