const test = require('ava');
const { createUser } = require('./helpers/fixtures');
const { init } = require('./helpers/orm');

test.before(async t => {
    t.context.orm = await init();

    t.context.userData = require('../utils/userData');

    const { UserData } = require('../models');
    t.context.user1 = await createUser();
    t.context.user2 = await createUser();
    await UserData.create({
        user_id: t.context.user2.id,
        key: 'test',
        data: 'value'
    });
});

test.after.always(t => t.context.orm.db.close());

test('default for missing userdata', async t => {
    const { userData, user1 } = t.context;
    const { getUserData } = userData;
    const val = await getUserData(user1.id, 'missing', 42);
    t.is(val, 42);
});

test('get and update existing userdata', async t => {
    const { userData, user2 } = t.context;
    const { getUserData, setUserData } = userData;
    // get old value
    const val1 = await getUserData(user2.id, 'test');
    // set new value
    await setUserData(user2.id, 'test', 'new-value');
    const val2 = await getUserData(user2.id, 'test');
    // reset to old value
    await setUserData(user2.id, 'test', val1);
    const val3 = await getUserData(user2.id, 'test');
    t.is(val1, 'value');
    t.is(val2, 'new-value');
    t.is(val3, 'value');
});

test('set and remove new userdata', async t => {
    const { userData, user1 } = t.context;
    const { getUserData, setUserData, unsetUserData } = userData;
    // get old value
    const val1 = await getUserData(user1.id, 'missing-key');
    // set new value
    await setUserData(user1.id, 'missing-key', 'new-value');
    const val2 = await getUserData(user1.id, 'missing-key');
    // reset to old value
    await unsetUserData(user1.id, 'missing-key');
    const val3 = await getUserData(user1.id, 'missing-key');
    t.is(val1, undefined);
    t.is(val2, 'new-value');
    t.is(val3, undefined);
});
