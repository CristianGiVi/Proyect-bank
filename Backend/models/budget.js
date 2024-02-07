const Sequelize = require('sequelize');
const Db = require('../database/mysqldb');
const Slug = require('slug');

const path = require('path');
const Phase = require(path.resolve(__dirname, './phase'));
const Profile = require(path.resolve(__dirname, './profile'));

const Budget = Db.define('budget', 
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
            type: Sequelize.INTEGER(11)
        },
        frecuency: {
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
            beforeCreate(budget) {
                const nameSlug = Slug(budget.name).toLowerCase(); // Genera el slug del nombre
                const dateSlug = budget.date.toISOString().split('T')[0].replace(/-/g, ''); // Convierte la fecha en formato YYYYMMDD

                budget.slug = `${nameSlug}-${dateSlug}`; // Concatena el slug del nombre y el slug de la fecha
            }
        }
    }
);

Budget.belongsTo(Phase, {
    foreignKey: 'phase_id'
});

Budget.belongsTo(Profile, {
    foreignKey: 'profile_id'
});

module.exports = Budget;