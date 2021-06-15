const test = require('ava');
const { createChart, createJob, createUser, destroy } = require('./helpers/fixtures');
const { init } = require('./helpers/orm');

test.before(async t => {
    t.context.orm = await init();

    t.context.chart = await createChart();
    t.context.user = await createUser();
});

test.after.always(async t => {
    await destroy(t.context.user, t.context.chart);
    await t.context.orm.db.close();
});

test('task exists', async t => {
    const { chart, user } = t.context;
    let job;
    try {
        job = await createJob({ chart, user });
        t.is(typeof job.tasks, 'object', 'job.tasks is no object');
        t.is(job.tasks.length, 1);
    } finally {
        if (job) {
            await job.destroy({ force: true });
        }
    }
});

test('process task', async t => {
    const { chart, user } = t.context;
    let job;
    try {
        job = await createJob({ chart, user });
        t.is(typeof job.process, 'function');
        t.is(typeof job.log, 'undefined');
        await job.process();
        t.is(typeof job.log, 'object');
        t.is(job.log.attempts, 1);
        t.is(job.user_id, user.id);
        t.is(job.chart_id, chart.id);
        // one more process attempt
        await job.process();
        t.is(job.log.attempts, 2);
        // lets check if attempts where really incremented
        await job.reload();
        t.is(job.log.attempts, 2);
        // one more time
        await job.process();
        await job.reload();
        t.is(job.log.attempts, 3);
    } finally {
        if (job) {
            await job.destroy({ force: true });
        }
    }
});

test('log progress', async t => {
    const { chart, user } = t.context;
    let job;
    try {
        job = await createJob({ chart, user });
        t.is(typeof job.logProgress, 'function');
        await job.logProgress({ message: 'foo' });
        await job.reload();
        t.is(typeof job.log.progress, 'object');
        t.is(job.log.progress.length, 1);
        t.is(job.log.progress[0].message, 'foo');
        await job.logProgress({ message: 'another message' });
        await job.reload();
        t.is(job.log.progress.length, 2);
    } finally {
        if (job) {
            await job.destroy({ force: true });
        }
    }
});

test('process & progress', async t => {
    const { chart, user } = t.context;
    let job;
    try {
        job = await createJob({ chart, user });
        await job.process();
        await job.logProgress({ message: 'foo' });
        await job.reload();
        t.is(job.log.attempts, 1);
        t.is(job.log.progress.length, 1);

        // more progress
        await job.logProgress({ message: 'foo' });
        await job.reload();
        t.is(job.log.attempts, 1);
        t.is(job.log.progress.length, 2);

        // process again
        await job.process();
        await job.reload();
        t.is(job.log.attempts, 2);
        t.is(job.log.progress.length, 2);
    } finally {
        if (job) {
            await job.destroy({ force: true });
        }
    }
});
