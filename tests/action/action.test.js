const test = require('ava');
const { close, init } = require('../index');

test.before(async t => {
    await init();
    const { Action, User } = require('../../models');
    const { logAction } = require('../../utils/action');
    const user = await User.findByPk(1);
    t.context = { Action, logAction, user };
});

test('log a new action', async t => {
    const { logAction, Action, user } = t.context;

    let res = await logAction(user, 'orm-test/run');
    t.is(res.key, 'orm-test/run');

    res = await logAction(user, 'orm-test/run', 123);
    t.is(res.details, 123);

    res = await logAction(user, 'orm-test/run', 'a string');
    t.is(res.details, 'a string');

    res = await logAction(user, 'orm-test/run', true);
    t.is(res.details, 'true');

    res = await logAction(user, 'orm-test/run', { foo: 'bar' });
    t.is(res.details, '{"foo":"bar"}');

    await Action.destroy({
        where: {
            key: 'orm-test/run'
        }
    });
});

test.after(t => close);
