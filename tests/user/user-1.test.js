const test = require('ava');
const { close, init } = require('../index');

/*
 * user 1 is an admin who does not have anything
 * no folders, no charts, no teams, etc
 */

test.before(async t => {
    await init();
    const { User } = require('../../models');
    t.context = await User.findByPk(1);
});

test('get user 1', t => {
    t.is(t.context.email, 'ci1@datawrapper.de');
});

test('user role property is admin', t => {
    t.is(t.context.role, 'admin');
});

test('user role getter returns admin', t => {
    t.is(t.context.get('role'), 'admin');
});

test('user.serialize returns object', t => {
    const obj = t.context.serialize();
    t.is(typeof obj, 'object');
});

test('serialized user excludes sensitive data', t => {
    const obj = t.context.serialize();
    t.is(obj.pwd, undefined);
    t.is(obj.activate_token, undefined);
    t.is(obj.reset_password_token, undefined);
    t.is(obj.customer_id, undefined);
    t.is(obj.created_at, undefined);
});

test('user.getCharts returns empty array', async t => {
    t.is(typeof t.context.getCharts, 'function', 'user.getCharts() is undefined');
    const result = await t.context.getCharts();
    t.is(result.constructor, Array);
    t.is(result.length, 0);
});

test('user.getTeams returns empty array', async t => {
    t.is(typeof t.context.getTeams, 'function', 'user.getTeams() is undefined');
    const result = await t.context.getTeams();
    t.is(result.constructor, Array);
    t.is(result.length, 0);
});

test('user.getFolders returns empty array', async t => {
    t.is(typeof t.context.getFolders, 'function', 'user.getFolders() is undefined');
    const result = await t.context.getFolders();
    t.is(result.constructor, Array);
    t.is(result.length, 0);
});

test('user.getThemes returns empty array', async t => {
    t.is(typeof t.context.getThemes, 'function', 'user.getThemes() is undefined');
    const result = await t.context.getThemes();
    t.is(result.constructor, Array);
    t.is(result.length, 0);
});

test('user.getUserData returns empty array', async t => {
    t.is(typeof t.context.getUserData, 'function', 'user.getUserData() is undefined');
    const result = await t.context.getUserData();
    t.is(result.constructor, Array);
    t.is(result.length, 0);
});

test('user.getProducts returns empty array', async t => {
    t.is(typeof t.context.getProducts, 'function', 'user.getProducts() is undefined');
    const result = await t.context.getProducts();
    t.is(result.constructor, Array);
    t.is(result.length, 0);
});

test.after(t => close);
