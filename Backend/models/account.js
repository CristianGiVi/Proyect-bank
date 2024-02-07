const Sequelize = require('sequelize');
const Db = require('../database/mysqldb');
const Slug = require('slug');

const Path = require('path');
const State = require(Path.resolve(__dirname, './state'));
const Profile = require(Path.resolve(__dirname, './profile'));
const Type = require(Path.resolve(__dirname, './type'));

const Account = Db.define('account', 
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING(100)
        },
        balance: {
            type: Sequelize.INTEGER(15)
        },
        slug: {
            type: Sequelize.STRING(100)
        }
    }, {
        hooks: {
            beforeCreate(account){
                account.slug = Slug(account.name).toLowerCase();
            }
        }
    }
);

Account.belongsTo(State, {
    foreignKey: 'state_id'
});

Account.belongsTo(Profile, {
    foreignKey: 'profile_id'
});

Account.belongsTo(Type, {
    foreignKey: 'type_id'
});

module.exports = Account;