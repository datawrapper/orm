const test = require('ava');
const { createTeam, createUser, destroy } = require('./helpers/fixtures');
const { init } = require('./helpers/orm');

test.before(async t => {
    t.context.orm = await init();

    t.context.team = await createTeam();

    const promises = Array(3)
        .fill()
        .map(() => createUser({ teams: [t.context.team] }));
    t.context.users = await Promise.all(promises);
});

test.after.always(async t => {
    await destroy(t.context.users, t.context.team);
    await t.context.orm.db.close();
});

test('team.getUsers returns three users', async t => {
    const { team } = t.context;
    t.is(typeof team.getUsers, 'function', 'team.getUsers() is undefined');
    const result = await team.getUsers();
    t.is(result.length, 3);
});
