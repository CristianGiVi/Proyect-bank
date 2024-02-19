const Sequelize = require('sequelize');
const Db = require('../database/mysqldb');
const Slug = require('slug');
const Path = require('path');
const Budget = require(Path.resolve(__dirname, './budget'));
const Account = require(Path.resolve(__dirname, './account'));
const Category = require(Path.resolve(__dirname, './category'));
const Movement = require(Path.resolve(__dirname, './movement'))

const Transaction = Db.define('transaction', 
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        amount: {
            type: Sequelize.INTEGER(15)
        },

        date: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW // Fecha de creación por defecto
        },
        slug: {
            type: Sequelize.STRING(100)
        }
    }, {
        hooks: {
            beforeCreate(transaction){
                transaction.slug = Slug(String(transaction.amount)).toLowerCase();
            }
        }
    }
);

Transaction.belongsTo(Account, {
    foreignKey: 'sender_id'
});

Transaction.belongsTo(Account, {
    foreignKey: 'recipient_id'
});

Transaction.belongsTo(Budget, {
    foreignKey: 'budget_id'
});

Transaction.belongsTo(Category, {
    foreignKey: 'category_id'
});

Transaction.belongsTo(Movement, {
    foreignKey: 'movement_id'
});

module.exports = Transaction;
