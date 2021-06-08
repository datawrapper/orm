const test = require('ava');
const { init } = require('./helpers/orm');

test.before(async t => {
    t.context.orm = await init();
});

test.after.always(t => t.context.orm.db.close());

test('"orm-test" plugin registration', async t => {
    const { orm } = t.context;
    let ORMTest;
    let row;
    try {
        // Test that "orm-test" is available.
        t.truthy(orm.plugins['orm-test']);

        const TestPlugin = require(orm.plugins['orm-test'].requirePath);
        ORMTest = await TestPlugin.register(orm);

        // Test that '"orm-test" is registered.
        t.is(orm.db.models.orm_test, ORMTest);

        row = await ORMTest.create({ data: 'Test' });

        // Test that "orm-test" can write data.
        t.truthy(row.id);
        t.is(row.data, 'Test');
    } finally {
        if (row) {
            await row.destroy();
        }
        if (ORMTest) {
            await ORMTest.drop();
        }
    }
});
