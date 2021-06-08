const test = require('ava');
const { init } = require('../helpers/orm');

test.before(async t => {
    t.context.orm = await init();
});

test.after.always(t => t.context.orm.db.close());

test('"orm-test" plugin registration', async t => {
    const { orm } = t.context;

    // Test that "orm-test" is available.
    t.truthy(orm.plugins['orm-test']);

    const TestPlugin = require(orm.plugins['orm-test'].requirePath);
    const ORMTest = await TestPlugin.register(orm);

    // Test that '"orm-test" is registered.
    t.is(orm.db.models.orm_test, ORMTest);

    const row = await ORMTest.create({ data: 'Test' });

    // Test that "orm-test" can write data.
    t.truthy(row.id);
    t.is(row.data, 'Test');

    // Remove "orm-test".
    await row.destroy();
    await ORMTest.drop();
});
