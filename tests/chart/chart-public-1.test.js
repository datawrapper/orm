const test = require('ava');
const { createChart } = require('../helpers/fixtures');
const { init } = require('../helpers/orm');

test.before(async t => {
    t.context.orm = await init();

    const { ChartPublic } = require('../../models');
    t.context.chart = await createChart({
        title: 'Test chart'
    });

    t.context.publicChart = await ChartPublic.create({
        id: t.context.chart.id,
        title: 'Test chart public'
    });
});

test.after.always(t => t.context.orm.db.close());

test('associated chart exists', async t => {
    const { publicChart } = t.context;
    const chart = await publicChart.getChart();

    t.is(publicChart.id, chart.id);
    t.is(publicChart.title, 'Test chart public');
    t.is(chart.title, 'Test chart');
});
