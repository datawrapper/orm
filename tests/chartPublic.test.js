const test = require('ava');
const { createChart, createTeam, createUser, destroy } = require('./helpers/fixtures');
const { init } = require('./helpers/orm');

test.before(async t => {
    t.context.orm = await init();

    const { ChartPublic } = require('../models');

    t.context.chartTeam = await createTeam();
    t.context.chartUser = await createUser({ teams: [t.context.chartTeam] });
    t.context.chart = await createChart({
        type: 'd3-bars',
        title: 'Test chart',
        metadata: {
            foo: 'chart metadata'
        },
        external_data: 'chart external data',
        author_id: t.context.chartUser.id,
        organization_id: t.context.chartTeam.id
    });

    t.context.publicChartTeam = await createTeam();
    t.context.publicChartUser = await createUser({ teams: [t.context.publicChartTeam] });
    t.context.publicChart = await ChartPublic.create({
        id: t.context.chart.id,
        type: 'd3-lines',
        title: 'Test chart public',
        metadata: {
            bar: 'public chart metadata'
        },
        external_data: 'public chart external data',
        author_id: t.context.publicChartUser.id,
        organization_id: t.context.publicChartTeam.id
    });
});

test.after.always(async t => {
    await destroy(t.context.publicChart, t.context.chart);
    await t.context.orm.db.close();
});

test('associated chart exists', async t => {
    const { publicChart } = t.context;
    const chart = await publicChart.getChart();

    t.is(publicChart.id, chart.id);
    t.is(publicChart.title, 'Test chart public');
    t.is(chart.title, 'Test chart');
});

test('chart.setAttributesFromPublicChart copies attributes from associated public chart', async t => {
    const { chart, publicChart, publicChartTeam, publicChartUser } = t.context;
    const newChart = await publicChart.getChart();
    await newChart.setAttributesFromPublicChart();

    t.is(newChart.id, chart.id);
    t.is(newChart.type, publicChart.type);
    t.is(newChart.title, publicChart.title);
    t.deepEqual(newChart.metadata, publicChart.metadata);
    t.is(newChart.external_data, publicChart.external_data);
    t.is((await newChart.getUser()).id, publicChartUser.id);
    t.is((await newChart.getTeam()).id, publicChartTeam.id);
});
