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

test('user may use plugin', async t => {
    // export-pdf is public
    t.true(await t.context.mayUsePlugin('export-pdf'));
    // private-plugin is private but user has access through userPluginCache
    t.true(await t.context.mayUsePlugin('private-plugin'));
});

test('user not use plugin', async t => {
    // plugin foo does not exist
    t.false(await t.context.mayUsePlugin('foo'));
    // disabled-plugin is public but not enabled
    t.false(await t.context.mayUsePlugin('disabled-plugin'));
    // private-plugin-2 is private and user has no access through userPluginCache
    t.false(await t.context.mayUsePlugin('private-plugin-2'));
});

test.after(t => close);
