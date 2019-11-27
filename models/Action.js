const SQ = require('sequelize');
const { db } = require('../index');

const Action = db.define(
    'action',
    {
        id: {
            type: SQ.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        key: SQ.STRING(512),
        identifier: SQ.STRING(512),
        details: SQ.STRING(512)
    },
    {
        createdAt: 'action_time',
        tableName: 'action'
    }
);

const User = require('./User');
Action.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Action;
