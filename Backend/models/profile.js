const Sequelize = require('sequelize');
const Db = require('../database/mysqldb');
const Slug = require('slug');

const Path = require('path');
const State = require(Path.resolve(__dirname, './state'));

const Profile = Db.define('Profile', 
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: Sequelize.STRING(100)
        },
        password: {
            type: Sequelize.STRING(100)
        },
        slug: {
            type: Sequelize.STRING(100)
        }
    }, {
        hooks: {
            beforeCreate(profile){
                profile.slug = Slug(profile.email).toLowerCase();
            }
        }
    }
);

Profile.belongsTo(State, {
    foreignKey: 'state_id'
});


module.exports = Profile;