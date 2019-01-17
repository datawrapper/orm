const test = require('ava');
const { close, models } = require('../index');
const { Team } = models;

/*
 * user 2 is an editor who has one chart
 */

test.before(async t => {
    t.context = await Team.findByPk('team-1');
});

test('team.getUsers returns two users', async t => {
    t.is(typeof t.context.getUsers, 'function', 'team.getUsers() is undefined');
    const result = await t.context.getUsers();
    t.is(result.length, 2);
});

test.after(t => close);
