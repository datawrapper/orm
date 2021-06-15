const SQ = require('sequelize');
const { db } = require('../index');

const UserData = db.define(
    'user_data',
    {
        id: {
            type: SQ.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        key: {
            type: SQ.STRING(128),
            allowNull: false
        },

        data: {
            type: SQ.STRING(4096),
            field: 'value'
        }
    },
    {
        createdAt: 'stored_at',
        tableName: 'user_data',
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'key']
            }
        ]
    }
);

const User = require('./User');

UserData.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(UserData, { as: 'UserData' });

module.exports = UserData;
