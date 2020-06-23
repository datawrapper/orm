const test = require('ava');
const { close, init } = require('../index');

/*
 * user 5 is not activated
 */

test.before(async t => {
    await init();
    const { User } = require('../../models');
    t.context = await User.findByPk(5);
});

test('get user 5', t => {
    t.is(t.context.email, 'ci5@datawrapper.de');
});

test('user role property is pending', t => {
    t.is(t.context.role, 'pending');
});

test('user role getter returns pending', t => {
    t.is(t.context.get('role'), 'pending');
});

test('user.serialize returns object', t => {
    const obj = t.context.serialize();
    t.is(typeof obj, 'object');
});

test('user.activate_token returns object', t => {
    const obj = t.context.serialize();
    t.is(t.context.activate_token, '12345678');
});

test('user.isActivated returns false', t => {
    const obj = t.context.serialize();
    t.is(t.context.isActivated(), false);
});

test.after(t => close);
