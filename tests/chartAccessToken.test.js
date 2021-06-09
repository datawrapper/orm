const test = require('ava');
const { createChart, createUser, destroy } = require('./helpers/fixtures');
const { init } = require('./helpers/orm');

test.before(async t => {
    t.context.orm = await init();

    t.context.chart = await createChart();

    const { ChartAccessToken } = require('../models');
    t.context.ChartAccessToken = ChartAccessToken;

    t.context.user = await createUser();
});

test.after.always(async t => {
    await destroy(t.context.user, t.context.chart);
    await t.context.orm.db.close();
});

test('create a new ChartAccessToken', async t => {
    const { ChartAccessToken, chart, user } = t.context;
    let res;
    try {
        res = await ChartAccessToken.newToken({
            chart_id: chart.id
        });

        t.is(typeof res.token, 'string');
        t.is(res.token.length, 32);
        t.is(res.chart_id, chart.id);
    } finally {
        if (res && res.token) {
            await ChartAccessToken.destroy({ where: { token: res.token } });
        }
    }
});
