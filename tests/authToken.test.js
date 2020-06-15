const test = require('ava');
const { close, init } = require('./index');

test.before(async t => {
    await init();
    const { AuthToken, User } = require('../models');
    const user = await User.findByPk(1);
    t.context = { AuthToken, user };
});

test('log a new AuthToken', async t => {
    const { AuthToken, user } = t.context;

    const res = await AuthToken.newToken({
        user_id: user.id,
        comment: 'orm-test/run'
    });

    t.is(res.comment, 'orm-test/run');
    t.is(typeof res.token, 'string');
    t.is(res.token.length, 64);
    t.is(res.user_id, user.id);

    await AuthToken.destroy({
        where: {
            comment: 'orm-test/run'
        }
    });
});

test.after(t => close);
