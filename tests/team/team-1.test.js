const test = require('ava');
const { close, init } = require('../index');

/*
 * user 2 is an editor who has one chart
 */

test.before(async t => {
    await init();
    const { Team } = require('../../models');
    t.context = await Team.findByPk('team-1');
});

test('team.getUsers returns two users', async t => {
    t.is(typeof t.context.getUsers, 'function', 'team.getUsers() is undefined');
    const result = await t.context.getUsers();
    t.is(result.length, 2);
});

test.after(t => close);
