const Sequelize = require('sequelize');
const Db = require('../database/mysqldb');
const Slug = require('slug');

const State = Db.define('state', 
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
            beforeCreate(state){
                state.slug = Slug(state.name).toLowerCase();
            }
        }
    }
);



module.exports = State;