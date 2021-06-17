const test = require('ava');
const { createTheme, destroy } = require('./helpers/fixtures');
const { findWhere } = require('underscore');
const { init } = require('./helpers/orm');

test.before(async t => {
    t.context.orm = await init();

    const { Theme } = require('../models');
    t.context.Theme = Theme;

    t.context.grandparentTheme = await createTheme({
        data: {
            easing: 'easeInOut'
        }
    });
    t.context.parentTheme = await createTheme({
        data: {
            colors: {
                general: {
                    padding: 0
                },
                palette: ['two', 'items']
            }
        },
        assets: {
            Helvetica: 'helvetica'
        },
        extend: t.context.grandparentTheme.id
    });
    t.context.theme1 = await createTheme({
        data: {
            colors: {
                general: {
                    background: '#f9f9f9'
                },
                palette: ['one-item']
            },
            typography: {
                chart: {
                    fontSize: 13
                }
            }
        },
        assets: {
            Roboto: 'roboto'
        },
        extend: t.context.parentTheme.id
    });
    t.context.theme2 = await createTheme();

    const { getAllMergedThemes } = require('../utils/theme');
    t.context.themes = await getAllMergedThemes();
});

test.after.always(async t => {
    await destroy(
        t.context.theme2,
        t.context.theme1,
        t.context.parentTheme,
        t.context.grandparentTheme
    );
    await t.context.orm.db.close();
});

test('get theme.data', t => {
    const { theme1: theme } = t.context;
    t.is(typeof theme.data, 'object');
    t.is(theme.data.colors.general.background, '#f9f9f9');
});

test('get theme.assets', async t => {
    const { Theme } = t.context;
    const theme = await Theme.findByPk(t.context.theme1.id);
    t.is(typeof theme.assets, 'object');
    t.truthy(theme.assets.Roboto);
    t.falsy(theme.assets.Helvetica);
});

test('set theme.data', async t => {
    const { theme1: theme } = t.context;
    // font size in db is 13
    t.is(theme.data.typography.chart.fontSize, 13);

    // set fontsize to 15
    theme.set('data.typography.chart.fontSize', 15);

    // check if local data is ok
    t.is(theme.data.typography.chart.fontSize, 15);

    // save change to DB
    await theme.save();

    // check if change has been saved properly
    await theme.reload();
    t.is(theme.data.typography.chart.fontSize, 15);

    // reset value to 13
    theme.set('data.typography.chart.fontSize', 13);
    await theme.save();
    await theme.reload();
    t.is(theme.data.typography.chart.fontSize, 13);
});

test('theme.getMergedData', async t => {
    const { theme1: theme } = t.context;
    t.is(typeof theme.getMergedData, 'function', 'theme.getMergedData() is undefined');
    const data = await theme.getMergedData();
    t.is(typeof data, 'object');
    // check a property coming from the theme itself
    t.is(data.colors.general.background, '#f9f9f9');
    // check a property coming from parent theme "datawrapper"
    t.is(data.colors.general.padding, 0);
    // check a property coming from grand-parents theme "default"
    t.is(data.easing, 'easeInOut');
});

test('theme.getMergedData does not get stuck in an extend loop', async t => {
    let theme1;
    let theme2;
    try {
        theme1 = await createTheme({
            data: { foo: 1 }
        });
        theme2 = await createTheme({
            data: { foo: 2, bar: 2 },
            extend: theme1.id
        });
        theme1.extend = theme2.id;
        await theme1.save();
        const data = await theme1.getMergedData();
        t.deepEqual(data, { foo: 1, bar: 2 });
    } finally {
        await destroy(theme1);
        await destroy(theme2);
    }
});

test('theme.getMergedAssets', async t => {
    const { theme1: theme } = t.context;
    t.is(typeof theme.getMergedAssets, 'function', 'theme.getMergedAssets() is undefined');
    const assets = await theme.getMergedAssets();
    t.is(typeof assets, 'object');
    // check a property coming from the theme itself
    t.truthy(assets.Roboto);
    t.truthy(assets.Helvetica);
});

test('utils.getAllMergedThemes returns merged data', t => {
    const { themes } = t.context;
    t.true(themes.length > 1);
    const theme = findWhere(themes, { id: t.context.theme1.id });
    // check a property coming from the theme itself
    t.is(theme.data.colors.general.background, '#f9f9f9');
    // check a property coming from parent theme "datawrapper"
    t.is(theme.data.colors.general.padding, 0);
    // check that the palettes haven't been merged
    t.is(theme.data.colors.palette.length, 1);
    // check a property coming from grand-parents theme "default"
    t.is(theme.data.easing, 'easeInOut');
});

test('utils.getAllMergedThemes returns merged assets', t => {
    const { themes } = t.context;
    t.true(themes.length > 1);
    const theme = findWhere(themes, { id: t.context.theme1.id });
    // check a property coming from the theme itself
    t.truthy(theme.assets.Roboto);
    t.truthy(theme.assets.Helvetica);
});
