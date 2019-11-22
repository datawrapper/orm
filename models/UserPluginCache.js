const SQ = require('sequelize');
const { db } = require('../index');

const UserPluginCache = db.define(
    'user_plugin_cache',
    {
        user_id: {
            type: SQ.INTEGER,
            primaryKey: true
        },
        plugins: SQ.TEXT
    },
    {
        tableName: 'user_plugin_cache',
        timestamps: false
    }
);

const User = require('./User');

UserPluginCache.belongsTo(User);
User.hasOne(UserPluginCache, { as: 'UserPluginCache', timestamps: false, foreignKey: 'user_id' });

module.exports = UserPluginCache;
