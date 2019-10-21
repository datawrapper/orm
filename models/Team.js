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

Team.prototype.invalidatePluginCache = async function() {
    const UserTeam = require('./UserTeam');
    const UserPluginCache = require('./UserPluginCache');

    const userTeams = await UserTeam.findAll({
        where: {
            organization_id: this.id
        }
    });

    let userQuery = { [SQ.Op.or]: [] };

    for (let userTeam of userTeams) {
        userQuery[SQ.Op.or].push({
            user_id: userTeam.user_id
        });
    }

    await UserPluginCache.destroy({
        where: userQuery
    });
};

const Theme = require('./Theme');
Team.belongsTo(Theme, { foreignKey: 'default_theme' });

module.exports = Team;
