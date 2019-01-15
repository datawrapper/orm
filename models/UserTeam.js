const SQ = require('sequelize');
const { db } = require('../index');

const UserTeam = db.define(
    'user_team',
    {
        team_role: {
            field: 'organization_role',
            type: SQ.ENUM('owner', 'admin', 'member'),
            allowNull: false,
            defaultValue: 'member',
            get () {
                const { team_role } = this.get();
                // const teamRole = this.getDataValue('team_role');
                return this.rawAttributes.team_role.values[team_role];
            },
            set (val) {
                if (typeof val == 'string') {
                    val = this.rawAttributes.team_role.values.indexOf(val);
                    if (val > -1) this.setDataValue('team_role', val);
                }
            }
        },

        invite_token: {
            type: SQ.STRING(128),
            allowNull: false,
            defaultValue: ''
        }
    },
    {
        tableName: 'user_organization',
        timestamps: false
    }
);

const User = require('./User');
const Team = require('./Team');

User.belongsToMany(Team, {
    through: UserTeam,
    foreignKey: 'user_id',
    timestamps: false
});

Team.belongsToMany(User, {
    through: UserTeam,
    foreignKey: 'organization_id',
    timestamps: false
});

module.exports = UserTeam;
