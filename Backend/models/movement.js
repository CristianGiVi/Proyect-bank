const Sequelize = require('sequelize');
const Db = require('../database/mysqldb');
const Slug = require('slug');

const Movement = Db.define('movement', 
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING(100)
        },
        slug: {
            type: Sequelize.STRING(100)
        }
    }, {
        hooks: {
            beforeCreate(movement){
                movement.slug = Slug(movement.name).toLowerCase();
            }
        }
    }
);

module.exports = Movement;