const test = require('ava');
const { close, init } = require('../index');

test.before(async t => {
    await init();
    const { User } = require('../../models');
    t.context = await User.findByPk(1);
});

test('user 1 has access to plugin', async t => {
    const res = await t.context.getUserPluginCache();
    const plugins = res.plugins.split(',');
    t.true(plugins.includes('export-pdf'));
});

test.after(t => close);
