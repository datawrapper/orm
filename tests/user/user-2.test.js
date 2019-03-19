const test = require('ava');
const { close, init } = require('../index');

/*
 * user 2 is an editor who has one chart
 */

test.before(async t => {
    await init();
    const { User, Team } = require('../../models');
    t.context = await User.findByPk(2, {
        include: [
            {
                model: Team
            }
        ]
    });
});

test('user role property is admin', t => {
    t.is(t.context.role, 'editor');
});

test('user.getCharts returns single chart', async t => {
    const result = await t.context.getCharts();
    t.is(result.length, 1);
    t.is(result[0].title, 'Test chart');
});

test('user.getTeams returns single team', async t => {
    const result = await t.context.getTeams();
    // console.log(result[0].user_team.getDataValue('team_role'));
    t.is(result.length, 1);
    t.is(result[0].name, 'Team No. 1');
    t.is(result[0].user_team.getDataValue('team_role'), 0);
});

test.after(t => close);
