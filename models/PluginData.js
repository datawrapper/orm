const SQ = require('sequelize');
const {db} = require('../index');

const PluginData = db.define('plugin_data', {

    id: {
        type:SQ.INTEGER,
        primaryKey:true,
        autoIncrement: true
    },

    plugin_id: SQ.STRING(128),

    key: {
        type: SQ.STRING(128),
        allowNull: false
    },

    data: SQ.STRING(4096)

}, {
    createdAt: 'stored_at',
    tableName: 'plugin_data',
});

module.exports = PluginData;
