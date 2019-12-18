const test = require('ava');
const { close, init } = require('./index');

test.before(async t => {
    await init();
    const { ChartAccessToken, User } = require('../models');
    const user = await User.findByPk(1);
    t.context = { ChartAccessToken, user };
});

test('create a new ChartAccessToken', async t => {
    const { ChartAccessToken, user } = t.context;

    const res = await ChartAccessToken.newToken({
        chart_id: 'aaaaa'
    });

    t.is(typeof res.token, 'string');
    t.is(res.token.length, 32);
    t.is(res.chart_id, 'aaaaa');

    await ChartAccessToken.destroy({
        where: {
            token: res.token
        }
    });
});

test.after(t => close);
