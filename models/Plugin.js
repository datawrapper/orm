const SQ = require('sequelize');
const {db} = require('../index');

const Plugin = db.define('plugin', {

    id: {
        type: SQ.STRING(128),
        primaryKey: true,
    },

    enabled: SQ.BOOLEAN,
    is_private: SQ.BOOLEAN // soon to be deprectad

}, {
    createdAt: 'installed_at',
    tableName: 'plugin',
});

module.exports = Plugin;
