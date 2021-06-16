const test = require('ava');
const { ValidationError } = require('sequelize');
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
        theme: 'chart theme',
        guest_session: null,
        last_edit_step: null,
        published_at: null,
        public_url: null,
        public_version: null,
        deleted: null,
        deleted_at: null,
        forkable: null,
        is_fork: null,
        metadata: {
            foo: 'chart metadata'
        },
        language: null,
        external_data: 'chart external data',
        utf8: null,
        author_id: t.context.chartUser.id,
        organization_id: t.context.chartTeam.id
    });

    t.context.publicChartTeam = await createTeam();
    t.context.publicChartUser = await createUser({ teams: [t.context.publicChartTeam] });
    t.context.publicChart = await ChartPublic.create({
        id: t.context.chart.id,
        type: 'd3-lines',
        title: 'Test chart public',
        theme: 'public chart theme',
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

test('ReadonlyChart.fromChart builds a new chart instance with values from passed chart', async t => {
    const ReadonlyChart = require('../models/ReadonlyChart');
    const { chart, chartTeam, chartUser } = t.context;
    const readonlyChart = await ReadonlyChart.fromChart(chart);

    t.true(readonlyChart instanceof ReadonlyChart);
    t.truthy(readonlyChart.createdAt);
    t.is(readonlyChart.id, chart.id);
    t.is(await readonlyChart.getPublicId(), chart.id);
    t.is(readonlyChart.type, chart.type);
    t.is(readonlyChart.title, chart.title);
    t.is(readonlyChart.theme, chart.theme);
    t.is(readonlyChart.guest_session, chart.guest_session);
    t.is(readonlyChart.last_edit_step, chart.last_edit_step);
    t.is(readonlyChart.published_at, chart.published_at);
    t.is(readonlyChart.public_url, chart.public_url);
    t.is(readonlyChart.public_version, chart.public_version);
    t.is(readonlyChart.deleted, chart.deleted);
    t.is(readonlyChart.deleted_at, chart.deleted_at);
    t.is(readonlyChart.forkable, chart.forkable);
    t.is(readonlyChart.is_fork, chart.is_fork);
    t.deepEqual(readonlyChart.metadata, chart.metadata);
    t.is(readonlyChart.language, chart.language);
    t.is(readonlyChart.external_data, chart.external_data);
    t.is(readonlyChart.utf8, chart.utf8);
    t.is((await readonlyChart.getUser()).id, chartUser.id);
    t.is((await readonlyChart.getTeam()).id, chartTeam.id);
});

test('ReadonlyChart.fromPublicChart builds a new chart instance with values from passed public chart', async t => {
    const ReadonlyChart = require('../models/ReadonlyChart');
    const { chart, publicChart, publicChartTeam, publicChartUser } = t.context;
    const readonlyChart = await ReadonlyChart.fromPublicChart(chart, publicChart);

    t.true(readonlyChart instanceof ReadonlyChart);
    t.truthy(readonlyChart.createdAt);
    // Chart attributes
    t.is(readonlyChart.id, chart.id);
    t.is(await readonlyChart.getPublicId(), chart.id);
    t.is(readonlyChart.theme, chart.theme);
    t.is(readonlyChart.guest_session, chart.guest_session);
    t.is(readonlyChart.last_edit_step, chart.last_edit_step);
    t.is(readonlyChart.published_at, chart.published_at);
    t.is(readonlyChart.public_url, chart.public_url);
    t.is(readonlyChart.public_version, chart.public_version);
    t.is(readonlyChart.deleted, chart.deleted);
    t.is(readonlyChart.deleted_at, chart.deleted_at);
    t.is(readonlyChart.forkable, chart.forkable);
    t.is(readonlyChart.is_fork, chart.is_fork);
    t.is(readonlyChart.language, chart.language);
    t.is(readonlyChart.utf8, chart.utf8);
    // PublicChart attributes
    t.is(readonlyChart.id, publicChart.id);
    t.is(readonlyChart.type, publicChart.type);
    t.is(readonlyChart.title, publicChart.title);
    t.deepEqual(readonlyChart.metadata, publicChart.metadata);
    t.is(readonlyChart.external_data, publicChart.external_data);
    t.is((await readonlyChart.getUser()).id, publicChartUser.id);
    t.is((await readonlyChart.getTeam()).id, publicChartTeam.id);
});

test('ReadonlyChart.fromChart copies included model from passed chart', async t => {
    const Chart = require('../models/Chart');
    const ReadonlyChart = require('../models/ReadonlyChart');
    const { chart, chartUser } = t.context;

    const readonlyChart = await ReadonlyChart.fromChart(chart);
    t.is(readonlyChart.user, undefined);

    const chartWithUser = await Chart.findOne({ where: { id: chart.id }, include: 'user' });
    const readonlyChartWithUser = await ReadonlyChart.fromChart(chartWithUser);
    t.is(readonlyChartWithUser.user.id, chartUser.id);
    t.is(readonlyChartWithUser.user.id, readonlyChartWithUser.dataValues.user.id);
    t.is(readonlyChartWithUser.user.id, readonlyChartWithUser.author_id);
});

test('ReadonlyChart.fromPublicChart copies included model from passed chart', async t => {
    const Chart = require('../models/Chart');
    const ReadonlyChart = require('../models/ReadonlyChart');
    const { chart, chartUser, publicChart, publicChartUser } = t.context;

    const readonlyChart = await ReadonlyChart.fromPublicChart(chart, publicChart);
    t.is(readonlyChart.user, undefined);

    const chartWithUser = await Chart.findOne({ where: { id: chart.id }, include: 'user' });
    const readonlyChartWithUser = await ReadonlyChart.fromPublicChart(chartWithUser, publicChart);
    t.is(readonlyChartWithUser.user.id, chartUser.id);
    t.is(readonlyChartWithUser.user.id, readonlyChartWithUser.dataValues.user.id);
    // There is no Sequelize association between ChartPublic and User, therefore the `user` property
    // (copied from Chart) can contain a different user than `author_id` (stored on `PublicChart`).
    t.not(readonlyChartWithUser.user.id, readonlyChartWithUser.author_id);
});

test('ReadonlyChart cannot be saved', async t => {
    const ReadonlyChart = require('../models/ReadonlyChart');
    const { chart } = t.context;
    const readonlyChart = await ReadonlyChart.fromChart(chart);

    await t.throwsAsync(
        async () => {
            await readonlyChart.save();
        },
        { instanceOf: ValidationError }
    );
});
