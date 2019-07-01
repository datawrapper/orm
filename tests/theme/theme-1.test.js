const test = require('ava');
const { close, init } = require('../index');

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

test('get theme.assets', async t => {
    const { Theme } = require('../../models');
    const theme = await Theme.findByPk('datawrapper');
    t.is(typeof theme.assets, 'object');
    t.truthy(theme.assets.Roboto);
    t.falsy(theme.assets.Helvetica);
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

test('theme.getMergedData', async t => {
    t.is(typeof t.context.getMergedData, 'function', 'theme.getMergedData() is undefined');
    const data = await t.context.getMergedData();
    t.is(typeof data, 'object');
    // check a property coming from the theme itself
    t.is(data.colors.general.background, '#f9f9f9');
    // check a property coming from parent theme "datawrapper"
    t.is(data.colors.general.padding, 0);
    // check a property coming from grand-parents theme "default"
    t.is(data.easing, 'easeInOut');
});

test('theme.getMergedAssets', async t => {
    t.is(typeof t.context.getMergedAssets, 'function', 'theme.getMergedAssets() is undefined');
    const assets = await t.context.getMergedAssets();
    t.is(typeof assets, 'object');
    // check a property coming from the theme itself
    t.truthy(assets.Roboto);
    t.truthy(assets.Helvetica);
});

test.after(t => close);
