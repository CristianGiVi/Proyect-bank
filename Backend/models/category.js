const Sequelize = require('sequelize');
const Db = require('../database/mysqldb');
const Slug = require('slug');

const Category = Db.define('category', 
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
            beforeCreate(category){
                category.slug = Slug(category.name).toLowerCase();
            }
        }
    }
);

module.exports = Category;