const test = require('ava');
const { close, init } = require('../index');

test.before(async t => {
    await init();
    const { ChartPublic } = require('../../models');
    t.context.publicChart = await ChartPublic.findByPk('aaaaa');
});

test('public chart exists', async t => {
    t.is(t.context.publicChart.id, 'aaaaa');
});

test('associated chart exists', async t => {
    const chart = await t.context.publicChart.getChart();
    t.is(t.context.publicChart.id, chart.id);
    t.is(t.context.publicChart.title, 'Test chart public');
    t.is(chart.title, 'Test chart');
});

test.after(t => close);
