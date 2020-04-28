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
    const cleanUp = [];
    t.context = {
        cleanUp,
        async createJob() {
            const job = await ExportJob.create({
                chart_id: 'aaaaa',
                user_id: 1,
                key: 'test-task',
                created_at: new Date(),
                status: 'queued',
                priority: 0,
                tasks: [{ action: 'sleep', params: { delay: 500 } }]
            });
            cleanUp.push(job);
            return job;
        }
    };
});

test('task exists', async t => {
    const job = await t.context.createJob();
    t.is(typeof job.tasks, 'object', 'job.tasks is no object');
    t.is(job.tasks.length, 1);
});

test('process task', async t => {
    const job = await t.context.createJob();
    t.is(typeof job.process, 'function');
    t.is(typeof job.log, 'undefined');
    await job.process();
    t.is(typeof job.log, 'object');
    t.is(job.log.attempts, 1);
    t.is(job.user_id, 1);
    t.is(job.chart_id, 'aaaaa');
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
});

test('log progress', async t => {
    const job = await t.context.createJob();
    t.is(typeof job.logProgress, 'function');
    await job.logProgress({ message: 'foo' });
    await job.reload();
    t.is(typeof job.log.progress, 'object');
    t.is(job.log.progress.length, 1);
    t.is(job.log.progress[0].message, 'foo');
    await job.logProgress({ message: 'another message' });
    await job.reload();
    t.is(job.log.progress.length, 2);
});

test('process & progress', async t => {
    const job = await t.context.createJob();
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
});

test.after(async t => {
    for (let i = 0; i < t.context.cleanUp.length; i++) {
        await t.context.cleanUp[i].destroy();
    }
    close();
});
