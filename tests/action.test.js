const test = require('ava');
const { close, init } = require('./index');

test.before(async t => {
    await init();
    const { Action, User } = require('../models');
    const { logAction } = require('../utils/action');
    const user = await User.findByPk(1);
    t.context = { Action, logAction, user };
});

test('log a new action', async t => {
    const { logAction, Action, user } = t.context;

    let res = await logAction(user.id, 'orm-test/run');
    t.is(res.key, 'orm-test/run');

    res = await logAction(user.id, 'orm-test/run', 123);
    t.is(res.details, 123);
    t.is(res.user_id, user.id);

    res = await logAction(2, 'orm-test/run', 'a string');
    t.is(res.details, 'a string');
    t.is(res.user_id, 2);

    res = await logAction(user.id, 'orm-test/run', true);
    t.is(res.details, 'true');

    res = await logAction(user.id, 'orm-test/run', { foo: 'bar' });
    t.is(res.details, '{"foo":"bar"}');

    await Action.destroy({
        where: {
            key: 'orm-test/run'
        }
    });
});

test('check if action was actually stored', async t => {
    const { logAction, Action, user } = t.context;

    const random = `xyz-${Math.random()}`;
    await logAction(user.id, 'orm-test/another', random);
    // load action from db
    const action = await Action.findOne({
        where: {
            key: 'orm-test/another',
            details: random
        }
    });
    t.truthy(action);

    await action.destroy();
    // out of curiosity, check if we can access properties
    // after action has been destroyed
    t.is(action.details, random);
});

test('log action without user id', async t => {
    const { logAction } = t.context;
    let action = await logAction(null, 'orm-test/no-user', 'details');
    await action.reload();
    t.is(action.user_id, null);
    t.is(action.key, 'orm-test/no-user');
    await action.destroy();

    // test if it also works with user_id: undefined
    action = await logAction(undefined, 'orm-test/no-user', 'details');
    await action.reload();
    t.is(action.user_id, null);
    t.is(action.key, 'orm-test/no-user');
    await action.destroy();
});

test.after(t => close);
