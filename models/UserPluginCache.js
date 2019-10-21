const SQ = require('sequelize');
const { db } = require('../index');

const UserPluginCache = db.define(
    'user_plugin_cache',
    {
        plugins: SQ.TEXT
    },
    {
        tableName: 'user_plugin_cache',
        timestamps: false
    }
);

const User = require('./User');

UserPluginCache.belongsTo(User);
User.hasMany(UserPluginCache, { as: 'UserPluginCache', timestamps: false });

module.exports = UserPluginCache;
