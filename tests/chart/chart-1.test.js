const test = require('ava');
const { close, models } = require('../index');
const { Chart } = models;

test.before(async t => {
    t.context = await Chart.findByPk('aaaaa');
});

test('metadata is object', t => {
    t.is(typeof t.context.metadata, 'object');
});

test('get metadata properties', t => {
    t.is(t.context.metadata.data.transpose, false);
    t.is(t.context.metadata.publish['embed-width'], 600);
});

test.after(t => close);
