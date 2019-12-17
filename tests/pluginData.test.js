const test = require('ava');
const { close, init } = require('./index');

test.before(async t => {
    await init();
    const { PluginData, Plugin } = require('../models');
    const plugin = await Plugin.findByPk('hello-world');
    t.context = { PluginData, Plugin, plugin };
});

test('create a new ChartAccessToken', async t => {
    const { PluginData, Plugin, plugin } = t.context;

    const res = await PluginData.create({
        plugin_id: plugin.id,
        stored_at: new Date(),
        key: 'orm-test',
        data: 'It works'
    });

    t.is(res.plugin_id, plugin.id);
    t.is(res.key, 'orm-test');
    t.is(res.data, 'It works');
    t.true(res.stored_at instanceof Date);

    // store another one
    const res2 = await PluginData.create({
        plugin_id: plugin.id,
        stored_at: new Date(),
        key: 'orm-test',
        data: 'It worked again'
    });

    // load plugin data
    const pd = await plugin.getPluginData();
    t.is(pd.length, 2);
    t.is(pd[0].key, 'orm-test');
    t.is(pd[0].plugin_id, plugin.id);
    t.is(pd[1].plugin_id, plugin.id);

    await PluginData.destroy({
        where: {
            key: 'orm-test'
        }
    });
});

test.after(t => close);
