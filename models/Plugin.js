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
Plugin.register = async function (app, plugins) {
    const PluginData = require('./PluginData');

    // first remove all plugins registered prei
    await PluginData.destroy({
        where: {
            key: 'installed_by',
            data: app
        }
    });

    // then make sure the plugins are in the plugin list
    await Plugin.bulkCreate(
        plugins.map(p => {
            return {
                id: p,
                enabled: true,
                is_private: false
            };
        }),
        { ignoreDuplicates: true }
    );

    // add installed_at entries for this app
    await PluginData.bulkCreate(
        plugins.map(p => {
            return {
                plugin_id: p,
                key: 'installed_by',
                data: app
            };
        })
    );

    // remove plugins that where not installed by any other app
    const remove = (await Plugin.findAll({ where: { id: { [SQ.Op.notIn]: plugins } } })).map(
        d => d.id
    );
    const keep = await PluginData.findAll({
        where: { plugin_id: { [SQ.Op.in]: remove }, key: 'installed_by' }
    });
    keep.forEach(p => {
        remove.splice(remove.indexOf(p.plugin_id), 1);
    });
    await Plugin.destroy({ where: { id: { [SQ.Op.in]: remove } } });
};

module.exports = Plugin;
