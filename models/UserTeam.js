const SQ = require('sequelize');
const { db } = require('../index');

const UserTeam = db.define(
    'user_team',
    {
        team_role: {
            field: 'organization_role',
            type: SQ.INTEGER,
            values: ['owner', 'admin', 'member'],
            allowNull: false,
            defaultValue: 2, // member
            get() {
                const teamRole = this.getDataValue('team_role');
                return this.rawAttributes.team_role.values[teamRole];
            },
            set(val) {
                if (typeof val === 'string') {
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
        createdAt: 'invited_at'
    }
);

const User = require('./User');
const Team = require('./Team');

User.belongsToMany(Team, {
    through: {
        model: UserTeam
    },
    foreignKey: 'user_id',
    timestamps: false
});

Team.belongsToMany(User, {
    through: {
        model: UserTeam
    },
    foreignKey: 'organization_id',
    timestamps: false
});

UserTeam.belongsTo(User, { foreignKey: 'invited_by' });

module.exports = UserTeam;
