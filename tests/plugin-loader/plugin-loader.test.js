const test = require('ava');
const { close, init } = require('../index');

test.beforeEach(async t => {
    t.context.ORM = await init();
});

test.serial('"orm-test" plugin registration', async t => {
    const { plugins } = t.context.ORM;

    t.truthy(plugins['orm-test']);
    t.log('"orm-test" is available');

    const TestPlugin = require(plugins['orm-test'].requirePath);
    const ORMTest = await TestPlugin.register(t.context.ORM);

    t.is(t.context.ORM.db.models.orm_test, ORMTest);
    t.log('"orm-test" is registered');

    const row = await ORMTest.create({ data: 'Test' });

    t.truthy(row.id);
    t.is(row.data, 'Test');
    t.log('"orm-test" can write data');

    await row.destroy();
    await ORMTest.drop();
    t.log('"orm-test" removed');
});

test.serial('ORM.registerPlugins registers all plugins', async t => {
    const { registerPlugins, plugins } = t.context.ORM;
    await registerPlugins();

    t.is(typeof t.context.ORM.db.models.orm_test, 'function');
    t.is(Object.keys(plugins).length, Object.keys(t.context.ORM.db.models).length);

    const ORMTest = t.context.ORM.db.models.orm_test;

    const row = await ORMTest.create({ data: 'Test-2' });

    t.truthy(row.id);
    t.is(row.data, 'Test-2');

    await row.destroy();
    await ORMTest.drop();
});

test.after(t => close);
