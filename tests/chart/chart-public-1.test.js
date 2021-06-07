const test = require('ava');
const { close, init } = require('../index');

test.before(async t => {
    await init();
    const { ChartPublic } = require('../../models');
    t.context = await ChartPublic.findByPk('aaaaa');
});

test('public chart exists', async t => {
    t.is(t.context.id, 'aaaaa');
});

test('associated chart exists', async t => {
    const chart = await t.context.getChart();
    t.is(t.context.id, chart.id);
    t.is(t.context.title, 'Test chart public');
    t.is(chart.title, 'Test chart');
});

test('chart has publicId', t => {
    t.is(typeof t.context.getPublicId, 'function');
});

test('chart has getThumbnailHash', t => {
    t.is(typeof t.context.getThumbnailHash, 'function');
    t.is(typeof t.context.getThumbnailHash(), 'string');
});

test.after(t => close);
