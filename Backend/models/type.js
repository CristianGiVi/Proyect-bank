const Sequelize = require('sequelize');
const Db = require('../database/mysqldb');
const Slug = require('slug');

const Type = Db.define('type', 
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
            beforeCreate(type){
                type.slug = Slug(type.name).toLowerCase();
            }
        }
    }
);



module.exports = Type;