const SQ = require('sequelize');
const { db } = require('../index');

const TeamTheme = db.define(
    'team_theme',
    {},
    {
        tableName: 'organization_theme',
        timestamps: false
    }
);

const Team = require('./Team');
const Theme = require('./Theme');

Team.belongsToMany(Theme, {
    through: TeamTheme,
    foreignKey: 'organization_id',
    timestamps: false
});

Theme.belongsToMany(Team, {
    through: TeamTheme,
    timestamps: false
});

module.exports = TeamTheme;
