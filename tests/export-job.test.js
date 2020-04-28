const test = require('ava');
const { close, init } = require('./index');

/**
 * test creates a new dummy ExportJob instance and tests the job.process()
 * and job.logProgress() methods
 */

test.before(async t => {
    await init();
    const { ExportJob } = require('../models');
    // create new test job
    t.context = await ExportJob.create({
        chart_id: 'aaaaa',
        user_id: 1,
        key: 'test-task',
        created_at: new Date(),
        status: 'queued',
        priority: 0,
        tasks: [{ action: 'sleep', params: { delay: 500 } }]
    });
});

test('task exists', async t => {
    t.is(typeof t.context.tasks, 'object', 'job.tasks is no object');
    t.is(t.context.tasks.length, 1);
});

test('process task', async t => {
    t.is(typeof t.context.process, 'function');
    t.is(typeof t.context.log, 'undefined');
    await t.context.process();
    t.is(typeof t.context.log, 'object');
    t.is(t.context.log.attempts, 1);
    t.is(t.context.user_id, 1);
    t.is(t.context.chart_id, 'aaaaa');
    // one more process attempt
    await t.context.process();
    t.is(t.context.log.attempts, 2);
    // lets log some progress in between
    await t.context.reload();
    t.is(t.context.log.attempts, 2);
});

test('log progress', async t => {
    t.is(typeof t.context.logProgress, 'function');
    await t.context.logProgress({ message: 'foo' });
    t.is(typeof t.context.log.progress, 'object');
    t.is(t.context.log.progress.length, 1);
    t.is(t.context.log.progress[0].message, 'foo');
    t.truthy(t.context.log.progress[0].timestamp instanceof Date);
    await t.context.logProgress({ message: 'another message' });
    t.is(t.context.log.progress.length, 2);
});

test.after(async t => {
    await t.context.destroy();
    close();
});
