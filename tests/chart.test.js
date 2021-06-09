const test = require('ava');
const { createChart, destroy } = require('./helpers/fixtures');
const { init } = require('./helpers/orm');

test.before(async t => {
    t.context.orm = await init();

    const { Chart } = require('../models');
    t.context.chart = await createChart({
        metadata: {
            data: {
                transpose: false
            },
            publish: {
                'embed-width': 600
            }
        }
    });
});

test.after.always(async t => {
    await destroy(t.context.chart);
    await t.context.orm.db.close();
});

test('metadata is object', t => {
    const { chart } = t.context;
    t.is(typeof chart.metadata, 'object');
});

test('get metadata properties', t => {
    const { chart } = t.context;
    t.is(chart.metadata.data.transpose, false);
    t.is(chart.metadata.publish['embed-width'], 600);
});

test('chart has publicId', t => {
    const { chart } = t.context;
    t.is(typeof chart.getPublicId, 'function');
});
