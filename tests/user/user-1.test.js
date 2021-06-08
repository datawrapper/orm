const test = require('ava');
const { createChart, createProduct, createUser } = require('../helpers/fixtures');
const { init } = require('../helpers/orm');

/*
 * user 1 is an admin who does not have anything
 * no folders, no charts, no teams, etc
 */

test.before(async t => {
    t.context.orm = await init();

    const { Chart } = require('../../models');
    t.context.Chart = Chart;

    t.context.user = await createUser({
        email: 'ci1@datawrapper.de',
        // role: admin
        pwd: 'test',
        activate_token: 'my-activate-token',
        reset_password_token: 'my-reset-passwod-token',
        customer_id: 'my-customer-id'
    });

    t.context.product = await createProduct();
});

test.after.always(t => t.context.orm.db.close());

test('user 1 email', t => {
    const { user } = t.context;
    t.is(user.email, 'ci1@datawrapper.de');
});

test('user 1 role property is admin', t => {
    const { user } = t.context;
    t.is(user.role, 'admin');
});

test('user 1 role getter returns admin', t => {
    const { user } = t.context;
    t.is(user.get('role'), 'admin');
});

test('user 1 user.serialize returns object', t => {
    const { user } = t.context;
    const obj = user.serialize();
    t.is(typeof obj, 'object');
});

test('user 1 serialized user excludes sensitive data', t => {
    const { user } = t.context;
    const obj = user.serialize();
    t.is(obj.pwd, undefined);
    t.is(obj.activate_token, undefined);
    t.is(obj.reset_password_token, undefined);
    t.is(obj.customer_id, undefined);
    t.is(obj.created_at, undefined);
});

test('user 1 has not charts', async t => {
    const { Chart, user } = t.context;
    t.is(typeof user.getCharts, 'function', 'user.getCharts() is undefined');
    const result = await user.getCharts();
    t.is(result.constructor, Array);
    t.is(result.length, 0);
    const chartCount = await Chart.count({ where: { author_id: user.id } });
    t.is(chartCount, 0);
});

test('user 1 user.getTeams returns empty array', async t => {
    const { user } = t.context;
    t.is(typeof user.getTeams, 'function', 'user.getTeams() is undefined');
    const result = await user.getTeams();
    t.is(result.constructor, Array);
    t.is(result.length, 0);
});

test('user 1 user.getFolders returns empty array', async t => {
    const { user } = t.context;
    t.is(typeof user.getFolders, 'function', 'user.getFolders() is undefined');
    const result = await user.getFolders();
    t.is(result.constructor, Array);
    t.is(result.length, 0);
});

test('user 1 user.getThemes returns empty array', async t => {
    const { user } = t.context;
    t.is(typeof user.getThemes, 'function', 'user.getThemes() is undefined');
    const result = await user.getThemes();
    t.is(result.constructor, Array);
    t.is(result.length, 0);
});

test('user 1 user.getUserData returns empty array', async t => {
    const { user } = t.context;
    t.is(typeof user.getUserData, 'function', 'user.getUserData() is undefined');
    const result = await user.getUserData();
    t.is(result.constructor, Array);
    t.is(result.length, 0);
});

test('user 1 user.getProducts returns empty array', async t => {
    const { user } = t.context;
    t.is(typeof user.getProducts, 'function', 'user.getProducts() is undefined');
    const result = await user.getProducts();
    t.is(result.constructor, Array);
    t.is(result.length, 0);
});

test('user 1 has lowest-prio product', async t => {
    const { product, user } = t.context;
    const activeProduct = await user.getActiveProduct();
    t.is(activeProduct.id, product.id);
});

test('user 1 has access to plugin', async t => {
    const { user } = t.context;
    const res = await user.getUserPluginCache();
    const plugins = res.plugins.split(',');
    t.true(plugins.includes('export-pdf'));
});

test('user 1 may use plugin', async t => {
    const { user } = t.context;
    // export-pdf is public
    t.true(await user.mayUsePlugin('export-pdf'));
    // private-plugin is private but user has access through userPluginCache
    t.true(await user.mayUsePlugin('private-plugin'));
});

test('user 1 may not use plugin', async t => {
    const { user } = t.context;
    // plugin foo does not exist
    t.false(await user.mayUsePlugin('foo'));
    // disabled-plugin is public but not enabled
    t.false(await user.mayUsePlugin('disabled-plugin'));
    // private-plugin-2 is private and user has no access through userPluginCache
    t.false(await user.mayUsePlugin('private-plugin-2'));
});
