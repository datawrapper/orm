const test = require('ava');
const { createUser } = require('../helpers/fixtures');
const { init } = require('../helpers/orm');

test.before(async t => {
    t.context.orm = await init();

    t.context.user = await createUser();
});

test.after.always(t => t.context.orm.db.close());

test('user 4 has product 1 through user-product', async t => {
    const { user } = t.context;
    const activeProduct = await user.getActiveProduct();
    t.truthy(activeProduct);
    t.is(activeProduct.id, 1);
});
