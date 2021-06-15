const test = require('ava');
const { createUser, destroy } = require('./helpers/fixtures');
const { init } = require('./helpers/orm');

test.before(async t => {
    t.context.orm = await init();

    const { Action } = require('../models');
    t.context.Action = Action;

    const { logAction } = require('../utils/action');
    t.context.logAction = logAction;

    t.context.user1 = await createUser();
    t.context.user2 = await createUser();
});

test.after.always(async t => {
    await destroy(t.context.user2, t.context.user1);
    await t.context.orm.db.close();
});

test('log a new action', async t => {
    const { Action, logAction, user1, user2 } = t.context;
    try {
        let res = await logAction(user1.id, 'orm-test/run');
        t.is(res.key, 'orm-test/run');

        res = await logAction(user1.id, 'orm-test/run', 123);
        t.is(res.details, 123);
        t.is(res.user_id, user1.id);

        res = await logAction(user2.id, 'orm-test/run', 'a string');
        t.is(res.details, 'a string');
        t.is(res.user_id, user2.id);

        res = await logAction(user1.id, 'orm-test/run', true);
        t.is(res.details, 'true');

        res = await logAction(user1.id, 'orm-test/run', { foo: 'bar' });
        t.is(res.details, '{"foo":"bar"}');
    } finally {
        await Action.destroy({ where: { key: 'orm-test/run' } });
    }
});

test('check if action was actually stored', async t => {
    const { logAction, Action, user1 } = t.context;
    try {
        const random = `xyz-${Math.random()}`;
        await logAction(user1.id, 'orm-test/another', random);
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
    } finally {
        await Action.destroy({ where: { key: 'orm-test/another' } });
    }
});

test('log action without user id', async t => {
    const { Action, logAction } = t.context;
    try {
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
    } finally {
        await Action.destroy({ where: { key: 'orm-test/no-user' } });
    }
});
