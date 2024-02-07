const Sequelize = require('sequelize');
const Db = require('../database/mysqldb');
const Slug = require('slug');

const Phase = Db.define('Phase', 
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
            beforeCreate(phase){
                phase.slug = Slug(phase.name).toLowerCase();
            }
        }
    }
);



module.exports = Phase;