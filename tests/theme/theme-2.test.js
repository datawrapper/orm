const test = require('ava');
const { close, init } = require('../index');
const { findWhere } = require('underscore');

test.before(async t => {
    await init();
    const { getAllMergedThemes } = require('../../utils/theme');
    t.context = await getAllMergedThemes();
});

test('get theme.data', t => {
    const themes = t.context;
    t.is(themes.length, 14);
    const theme = findWhere(themes, { id: 'datawrapper-blog' });
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
    const themes = t.context;
    t.is(themes.length, 14);
    const theme = findWhere(themes, { id: 'datawrapper-blog' });
    // check a property coming from the theme itself
    t.truthy(theme.assets.Roboto);
    t.truthy(theme.assets.Helvetica);
});

test.after(t => close);
