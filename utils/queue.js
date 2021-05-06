const { FlowProducer, Queue, QueueEvents } = require('bullmq');

const QUEUE_NAMES = {
    work: 'work-jobs',
    render: 'render-jobs'
};

const DEFAULT_OPTS = {
    removeOnFail: 50,
    removeOnComplete: 50
};
const DEFAULT_RETRY_OPTS = {
    // Retry the job after 1 second, 2 seconds and 4 seconds.
    attempts: 3,
    backoff: {
        type: 'exponential',
        delay: 1000
    }
};

function deserialize(v) {
    // TODO: Is there a function for this in ioredis or bullmq?
    if (!v || !Object.prototype.hasOwnProperty.call(v, 'data')) {
        return v;
    }
    if (v.type === 'Buffer') {
        return Buffer.from(v.data);
    }
    return v.data;
}

function ensureArray(v) {
    if (Array.isArray(v)) {
        return v;
    }
    return [v];
}

function assignJobOpts(job, opts) {
    const { retry, ...newOpts } = Object.assign(DEFAULT_OPTS, opts, job.opts);
    if (retry && !newOpts.attempts && !newOpts.backoff) {
        Object.assign(newOpts, DEFAULT_RETRY_OPTS);
    }
    job.opts = newOpts;
}

async function runJobs({ jobs, config: { connection, opts } }) {
    jobs.forEach(job => assignJobOpts(job, opts));
    if (jobs.length === 1) {
        const job = jobs[0];
        // TODO Remove debug logging
        console.log('running one job', job); // eslint-disable-line no-console
        const queue = new Queue(job.queueName, { connection });
        return queue.add(job.name, job.data, job.opts);
    }
    const flow = jobs.slice(1).reduce((acc, curr) => {
        curr.children = [acc];
        return curr;
    }, jobs[0]);
    // TODO Remove debug logging
    console.log('running job flow', flow); // eslint-disable-line no-console
    const flowProducer = new FlowProducer({ connection });
    const jobNode = await flowProducer.add(flow);
    return jobNode.job;
}

async function waitForJob({ job, config = {}, timeout }) {
    const { connection } = config;
    const queueEvents = new QueueEvents(job.queue.name, { connection });
    const res = await job.waitUntilFinished(queueEvents, timeout);
    const outputs = ensureArray(res).map(deserialize);
    return outputs;
}

module.exports = {
    QUEUE_NAMES,
    deserialize,
    ensureArray,
    runJobs,
    waitForJob
};
