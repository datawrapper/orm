const test = require('ava');
const { close, models } = require('../index');
const { User } = models;

/*
 * user 2 is an editor who has one chart
 */

test.before(async t => {
    t.context = await User.findByPk(2);
});

test('user role property is admin', t => {
    t.is(t.context.role, 'editor');
});

test('user.getCharts returns empty array', async t => {
    t.is(typeof t.context.getCharts, 'function', 'user.getCharts() is undefined');
    const result = await t.context.getCharts();
    t.is(result.constructor, Array);
    t.is(result.length, 2);
});

test.after(t => close);
