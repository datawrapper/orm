const SQ = require('sequelize');
const { db } = require('../index');

const Team = db.define(
    'team',
    {
        id: {
            type: SQ.STRING(128),
            primaryKey: true
        },

        name: SQ.STRING,
        deleted: SQ.BOOLEAN,
        disabled: SQ.BOOLEAN,

        settings: SQ.TEXT
    },
    {
        tableName: 'organization'
    }
);

const Theme = require('./Theme');
Team.belongsTo(Theme, { foreignKey: 'default_theme' });

module.exports = Team;
