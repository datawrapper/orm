const test = require('ava');
const { close, init } = require('../index');

test.before(async t => {
    await init();
    const { db } = require('../../index');
    const { User, Chart } = require('../../models');
    t.context = await User.findAll({
        include: [
            {
                model: Chart,
                required: false,
                attributes: ['id']
            }
        ],
        group: ['user.id'],
        attributes: {
            include: [[db.fn('COUNT', db.col('charts.id')), 'chart_count']]
        },
        order: [[db.fn('COUNT', db.literal('charts.id')), 'DESC']]
    });
});

test('found three users, sorted by chart count', t => {
    // 3 users in total
    t.is(t.context.length, 3);
    // first has two charts
    t.is(t.context[0].get('email'), 'ci3@datawrapper.de');
    t.is(t.context[0].get('chart_count'), 2);
    // second has one chart
    t.is(t.context[1].get('email'), 'ci2@datawrapper.de');
    t.is(t.context[1].get('chart_count'), 1);
    // third has no charts
    t.is(t.context[2].get('email'), 'ci1@datawrapper.de');
    t.is(t.context[2].get('chart_count'), 0);
});

test.after(t => close);
