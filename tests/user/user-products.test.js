const test = require('ava');
const { close, init } = require('../index');

test.before(async t => {
    await init();
    const { User } = require('../../models');
    t.context.models = { User };
});

test('user 1 has no products', async t => {
    const { User } = t.context.models;
    const user = await User.findByPk(1);
    const activeProduct = await user.getActiveProduct();
    t.falsy(activeProduct);
});

test('user 2 has product 1 (through team)', async t => {
    const { User } = t.context.models;
    const user = await User.findByPk(2);
    const activeProduct = await user.getActiveProduct();
    t.truthy(activeProduct);
    t.is(activeProduct.id, 1);
});

test('user 3 has product 2 (same team, but user product has higher prio)', async t => {
    const { User } = t.context.models;
    const user = await User.findByPk(3);
    const activeProduct = await user.getActiveProduct();
    t.truthy(activeProduct);
    t.is(activeProduct.id, 2);
});

test('user 4 has product 1 through user-product', async t => {
    const { User } = t.context.models;
    const user = await User.findByPk(4);
    const activeProduct = await user.getActiveProduct();
    t.truthy(activeProduct);
    t.is(activeProduct.id, 1);
});

test('user 5 has product 3 (two teams, but one has higher prio)', async t => {
    const { User } = t.context.models;
    const user = await User.findByPk(5);
    const activeProduct = await user.getActiveProduct();
    t.truthy(activeProduct);
    t.is(activeProduct.id, 3);
});

test.after(t => close);
