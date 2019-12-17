const SQ = require('sequelize');
const { db } = require('../index');

const PluginData = db.define(
    'plugin_data',
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

        data: SQ.STRING(4096)
    },
    {
        createdAt: 'stored_at',
        tableName: 'plugin_data'
    }
);

const Plugin = require('./Plugin');

PluginData.belongsTo(Plugin, { foreignKey: 'plugin_id' });
Plugin.hasMany(PluginData, { as: 'PluginData' });

module.exports = PluginData;
