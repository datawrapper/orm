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

test('user.getCharts returns single chart', async t => {
    const result = await t.context.getCharts();
    t.is(result.length, 1);
    t.is(result[0].title, 'Test chart');
});

test.after(t => close);
