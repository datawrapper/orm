const test = require('ava');
const { createUser } = require('../helpers/fixtures');
const { init } = require('../helpers/orm');

test.before(async t => {
    t.context.orm = await init();

    t.context.user = await createUser({
        activated: false
    });
});

test.after.always(t => t.context.orm.db.close());

test('user 5 email', t => {
    const { user } = t.context;
    t.is(user.email, 'ci5@datawrapper.de');
});

test('user 5 role property is pending', t => {
    const { user } = t.context;
    t.is(user.role, 'pending');
});

test('user 5 role getter returns pending', t => {
    const { user } = t.context;
    t.is(user.get('role'), 'pending');
});

test('user 5 user.serialize returns object', t => {
    const { user } = t.context;
    const obj = user.serialize();
    t.is(typeof obj, 'object');
});

test('user 5 user.activate_token returns object', t => {
    const { user } = t.context;
    const obj = user.serialize();
    t.is(user.activate_token, '12345678');
});

test('user 5 user.isActivated returns false', t => {
    const { user } = t.context;
    const obj = user.serialize();
    t.is(user.isActivated(), false);
});

test('user 5 has product 3 (two teams, but one has higher prio)', async t => {
    const { user } = t.context;
    const activeProduct = await user.getActiveProduct();
    t.truthy(activeProduct);
    t.is(activeProduct.id, 3);
});
