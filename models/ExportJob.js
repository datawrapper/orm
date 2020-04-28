const SQ = require('sequelize');
const { db } = require('../index');

const ExportJob = db.define(
    'export_job',
    {
        id: { type: SQ.INTEGER, primaryKey: true, autoIncrement: true },

        // key will be used to identify job types
        key: SQ.STRING,

        // the larger the priority, the sooner the job will be done
        priority: SQ.INTEGER,

        // current status of the job
        status: {
            type: SQ.ENUM('queued', 'in_progress', 'done', 'failed'),
            defaultValue: 'queued'
        },

        // when was the status changed from queued to in_progress
        processed_at: SQ.DATE,

        // when was the status changed to done or failed
        done_at: SQ.DATE,

        // the index of the last task the client has worked on
        last_task: SQ.INTEGER,

        // the task list
        tasks: SQ.JSON,

        // a log file with debug and error messages from the client
        // should not be tampered with manually, instead please use
        // job.logProgress()
        log: SQ.JSON
    },
    {
        tableName: 'export_job'
    }
);

/**
 * sets the processed_at timestamp, increments the attempts counter
 * and initializes the progress array
 */
ExportJob.prototype.process = async function() {
    const log = this.get('log') || {};
    log.progress = log.progress || [];
    log.attempts = (log.attempts || 0) + 1;
    this.set('log', log);
    this.processed_at = new Date();
    return this.save({ fields: ['processed_at', 'log'] });
};

/**
 * adds a new progress log entry
 */
ExportJob.prototype.logProgress = async function(info) {
    info.timestamp = new Date();
    const log = this.get('log') || {};
    const progress = (log.progress || []).concat([info]);
    this.set('log', { ...log, progress });
    return this.save({ fields: ['log'] });
};

const User = require('./User');
const Chart = require('./Chart');

ExportJob.belongsTo(User, { foreignKey: 'user_id' });
ExportJob.belongsTo(Chart, { foreignKey: 'chart_id' });

module.exports = ExportJob;
