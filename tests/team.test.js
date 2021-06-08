const test = require('ava');
const { createTeam, createUser } = require('./helpers/fixtures');
const { init } = require('./helpers/orm');

test.before(async t => {
    t.context.orm = await init();

    t.context.team = await createTeam();

    for (var i = 0; i < 3; i++) {
        await createUser({ team: t.context.team });
    }
});

test.after.always(t => t.context.orm.db.close());

test('team.getUsers returns three users', async t => {
    const { team } = t.context;
    t.is(typeof team.getUsers, 'function', 'team.getUsers() is undefined');
    const result = await team.getUsers();
    t.is(result.length, 3);
});
