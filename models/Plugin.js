const SQ = require('sequelize');
const { db } = require('../index');

const Plugin = db.define(
    'plugin',
    {
        id: {
            type: SQ.STRING(128),
            primaryKey: true
        },

        enabled: SQ.BOOLEAN,
        is_private: SQ.BOOLEAN // soon to be deprectad
    },
    {
        createdAt: 'installed_at',
        tableName: 'plugin'
    }
);

/*
 * use Plugin.register to make sure the apps' plugin show
 * up in the plugin database table
 */
Plugin.register = async function(app, plugins) {
    // make sure the plugins are in the plugin list
    await Plugin.bulkCreate(
        plugins.map(p => {
            return {
                id: p.replace('@datawrapper/plugin-', ''),
                enabled: true,
                is_private: false
            };
        }),
        { ignoreDuplicates: true }
    );
};

module.exports = Plugin;
