const test = require('ava');
const { close, init } = require('../index');

/*
 * user 2 is an editor who has one chart
 */

test.before(async t => {
    await init();
    const { Theme } = require('../../models');
    t.context = await Theme.findByPk('datawrapper-blog');
});

test('get theme.data', t => {
    const data = t.context.data;
    t.is(typeof data, 'object');
    t.is(data.colors.general.background, '#f9f9f9');
});

test('set theme.data', async t => {
    let theme = t.context;
    const data = theme.get('data');

    // set fontsize to 15
    data.typography.chart.fontSize = 15;
    theme.set('data', data);

    // check if local data is ok
    t.is(theme.get('data').typography.chart.fontSize, 15);

    // save change to DB
    await theme.save();

    // check if change has been saved properly
    await theme.reload();
    t.is(theme.data.typography.chart.fontSize, 15);

    // reset value to 13
    data.typography.chart.fontSize = 13;
    theme.set('data', data);
    await theme.save();
    await theme.reload();
    t.is(theme.data.typography.chart.fontSize, 13);
});

test.after(t => close);
