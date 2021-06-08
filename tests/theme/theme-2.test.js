const test = require('ava');
const { createTheme } = require('../helpers/fixtures');
const { init } = require('../helpers/orm');
const { findWhere } = require('underscore');

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
    t.context.theme = await createTheme({
        data: {
            colors: {
                general: {
                    background: '#f9f9f9',
                    palette: ['two', 'items']
                }
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

    await createTheme();

    const { getAllMergedThemes } = require('../../utils/theme');

    t.context.themes = await getAllMergedThemes();
});

test.after.always(t => t.context.orm.db.close());

test('get theme.data', t => {
    const { themes } = t.context;
    t.true(themes.length > 1);
    const theme = findWhere(themes, { id: t.context.theme.id });
    // check a property coming from the theme itself
    t.is(theme.data.colors.general.background, '#f9f9f9');
    // check a property coming from parent theme "datawrapper"
    t.is(theme.data.colors.general.padding, 0);
    // check that the palettes haven't been merged
    t.is(theme.data.colors.palette.length, 1);
    // check a property coming from grand-parents theme "default"
    t.is(theme.data.easing, 'easeInOut');
});

test('get theme.assets', t => {
    const { themes } = t.context;
    t.true(themes.length > 1);
    const theme = findWhere(themes, { id: t.context.theme.id });
    // check a property coming from the theme itself
    t.truthy(theme.assets.Roboto);
    t.truthy(theme.assets.Helvetica);
});
