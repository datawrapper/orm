const test = require('ava');
const { createTheme } = require('../helpers/fixtures');
const { init } = require('../helpers/orm');

test.before(async t => {
    t.context.orm = await init();

    const grandparentTheme = await createTheme({
        data: {
            easing: 'easeInOut'
        }
    });
    const parentTheme = await createTheme({
        data: {
            colors: {
                general: {
                    padding: 0
                },
                palette: ['one-item']
            }
        },
        assets: {
            Helvetica: 'helvetica'
        },
        extend: grandparentTheme.id
    });
    const theme = await createTheme({
        data: {
            colors: {
                general: {
                    background: '#f9f9f9'
                },
                palette: ['two', 'items']
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
        extend: parentTheme.id
    });

    t.context.theme = theme;
});

test.after.always(t => t.context.orm.db.close());

test('get theme.data', t => {
    const { data } = t.context.theme;
    t.is(typeof data, 'object');
    t.is(data.colors.general.background, '#f9f9f9');
});

test('get theme.assets', async t => {
    const { Theme } = require('../../models');
    const theme = await Theme.findByPk(t.context.theme.id);
    t.is(typeof theme.assets, 'object');
    t.truthy(theme.assets.Roboto);
    t.falsy(theme.assets.Helvetica);
});

test('set theme.data', async t => {
    const { theme } = t.context;
    const data = theme.data;
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
    const { theme } = t.context;
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

test('theme.getMergedAssets', async t => {
    const { theme } = t.context;
    t.is(typeof theme.getMergedAssets, 'function', 'theme.getMergedAssets() is undefined');
    const assets = await theme.getMergedAssets();
    t.is(typeof assets, 'object');
    // check a property coming from the theme itself
    t.truthy(assets.Roboto);
    t.truthy(assets.Helvetica);
});
