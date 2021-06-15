const test = require('ava');
const { createPlugin, destroy } = require('./helpers/fixtures');
const { init } = require('./helpers/orm');

test.before(async t => {
    t.context.orm = await init();

    const { PluginData, Plugin } = require('../models');
    t.context.PluginData = PluginData;

    t.context.plugin = await createPlugin();
});

test.after.always(async t => {
    await destroy(t.context.plugin);
    await t.context.orm.db.close();
});

test('create a new ChartAccessToken', async t => {
    const { PluginData, plugin } = t.context;
    try {
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
    } finally {
        await PluginData.destroy({ where: { key: 'orm-test' } });
    }
});
