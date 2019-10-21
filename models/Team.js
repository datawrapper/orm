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
const UserTeam = require('./UserTeam');
const UserPluginCache = require('./UserPluginCache');

Team.belongsTo(Theme, { foreignKey: 'default_theme' });

Team.prototype.invalidatePluginCache = async function() {
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

module.exports = Team;
