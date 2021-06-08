const test = require('ava');
const { createChart, createUser } = require('../helpers/fixtures');
const { init } = require('../helpers/orm');

test.before(async t => {
    t.context.orm = await init();

    const { Chart } = require('../../models');
    t.context.Chart = Chart;

    t.context.user = await createUser();

    await createChart({ author_id: t.context.user.id });
    await createChart({ author_id: t.context.user.id });
});

test.after.always(t => t.context.orm.db.close());

test('user 3 has two charts', async t => {
    const { Chart, user } = t.context;
    const chartCount = await Chart.count({ where: { author_id: user.id } });
    t.is(chartCount, 2);
});

test('user 3 has product 2 (same team, but user product has higher prio)', async t => {
    const { user } = t.context;
    const activeProduct = await user.getActiveProduct();
    t.truthy(activeProduct);
    t.is(activeProduct.id, 2);
});
