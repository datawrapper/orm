const test = require('ava');
const { createChart, createUser } = require('./helpers/fixtures');
const { init } = require('./helpers/orm');

test.before(async t => {
    t.context.orm = await init();

    t.context.chart = await createChart();

    const { ChartAccessToken } = require('../models');
    t.context.ChartAccessToken = ChartAccessToken;

    t.context.user = await createUser();
});

test.after.always(t => t.context.orm.db.close());

test('create a new ChartAccessToken', async t => {
    const { ChartAccessToken, chart, user } = t.context;

    const res = await ChartAccessToken.newToken({
        chart_id: chart.id
    });

    t.is(typeof res.token, 'string');
    t.is(res.token.length, 32);
    t.is(res.chart_id, chart.id);

    await ChartAccessToken.destroy({
        where: {
            token: res.token
        }
    });
});
