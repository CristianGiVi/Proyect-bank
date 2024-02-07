const Sequelize = require('sequelize');
const Db = require('../database/mysqldb');
const Slug = require('slug');
const Path = require('path');
const Budget = require(Path.resolve(__dirname, './budget'));
const Account = require(Path.resolve(__dirname, './account'));
const Category = require(Path.resolve(__dirname, './category'));

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
        model: {
            type: Sequelize.STRING(100)
        },
        date: {
            type: Sequelize.DATE, // Define la columna para la fecha de creación
            allowNull: false // Indica que la columna no puede ser nula
        },
        slug: {
            type: Sequelize.STRING(100)
        }
    }, {
        hooks: {
            beforeCreate(transaction) {
                const modelSlug = Slug(transaction.model).toLowerCase(); // Genera el slug del nombre
                const dateSlug = transaction.date.toISOString().split('T')[0].replace(/-/g, ''); // Convierte la fecha en formato YYYYMMDD

                transaction.slug = `${modelSlug}-${dateSlug}`; // Concatena el slug del nombre y el slug de la fecha
            }
        }
    }
);

Transaction.belongsTo(Account, {
    foreignKey: 'account_id'
});

Transaction.belongsTo(Budget, {
    foreignKey: 'budget_id'
});

Transaction.belongsTo(Category, {
    foreignKey: 'category_id'
});

module.exports = Transaction;
