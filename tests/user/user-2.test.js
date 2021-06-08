const test = require('ava');
const { createChart, createProduct, createTeam, createUser } = require('../helpers/fixtures');
const { init } = require('../helpers/orm');

test.before(async t => {
    t.context.orm = await init();

    const { Chart } = require('../../models');
    t.context.Chart = Chart;

    t.context.user = await createUser({
        // role: 'editor'
    });

    const team = await createTeam({
        user: t.context.user,
        name: 'Team No. 1'
    });

    t.context.product = await createProduct({
        team: t.context.team
    });

    await createChart({
        author_id: t.context.user.id,
        title: 'Test chart'
    });
});

test.after.always(t => t.context.orm.db.close());

test('user 2 user role property is admin', t => {
    const { user } = t.context;
    t.is(user.role, 'editor');
});

test('user 2 has one chart', async t => {
    const { Chart, user } = t.context;
    const result = await user.getCharts();
    t.is(result.length, 1);
    t.is(result[0].title, 'Test chart');
    const chartCount = await Chart.count({ where: { author_id: user.id } });
    t.is(chartCount, 0);
});

test('user 2 has one team', async t => {
    const { user } = t.context;
    const result = await user.getTeams();
    // console.log(result[0].user_team.getDataValue('team_role'));
    t.is(result.length, 1);
    t.is(result[0].name, 'Team No. 1');
    t.is(result[0].user_team.getDataValue('team_role'), 0);
});

test('user 2 has one team product', async t => {
    const { product, user } = t.context;
    const activeProduct = await user.getActiveProduct();
    t.truthy(activeProduct);
    t.is(activeProduct.id, product.id);
});
