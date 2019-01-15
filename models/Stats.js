const SQ = require('sequelize');
const { db } = require('../index');

const Stats = db.define(
    'stats',
    {
        id: {
            type: SQ.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        metric: {
            type: SQ.STRING,
            allowNull: false
        },

        value: {
            type: SQ.INTEGER,
            allowNull: false
        }
    },
    {
        createdAt: 'time',
        tableName: 'stats'
    }
);

module.exports = Stats;
