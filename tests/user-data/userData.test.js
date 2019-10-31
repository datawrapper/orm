const test = require('ava');
const { close, init } = require('../index');

/*
 * user 1 is an admin who does not have anything
 * no folders, no charts, no teams, etc
 */

test.before(async t => {
    await init();
    const userData = require('../../utils/userData');
    t.context = userData;
});

test('default for missing userdata', async t => {
    const { getUserData } = t.context;
    const val = await getUserData(1, 'missing', 42);
    t.is(val, 42);
});

test('get and update existing userdata', async t => {
    const { getUserData, setUserData } = t.context;
    // get old value
    const val1 = await getUserData(2, 'test');
    // set new value
    await setUserData(2, 'test', 'new-value');
    const val2 = await getUserData(2, 'test');
    // reset to old value
    await setUserData(2, 'test', val1);
    const val3 = await getUserData(2, 'test');
    t.is(val1, 'value');
    t.is(val2, 'new-value');
    t.is(val3, 'value');
});

test('set and remove new userdata', async t => {
    const { getUserData, setUserData, unsetUserData } = t.context;
    // get old value
    const val1 = await getUserData(1, 'missing-key');
    // set new value
    await setUserData(1, 'missing-key', 'new-value');
    const val2 = await getUserData(1, 'missing-key');
    // reset to old value
    await unsetUserData(1, 'missing-key');
    const val3 = await getUserData(1, 'missing-key');
    t.is(val1, undefined);
    t.is(val2, 'new-value');
    t.is(val3, undefined);
});

test.after(t => close);
