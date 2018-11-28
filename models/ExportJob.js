const SQ = require('sequelize');
const {db} = require('../index');

const ExportJob = db.define('export_job', {

    id: {type:SQ.INTEGER, primaryKey:true, autoIncrement: true},

    // key will be used to identify job types
    key: SQ.STRING,

    // the larger the priority, the sooner the job will be done
    priority: SQ.INTEGER,

    // the user who created/initiated the job
    user_id: SQ.INTEGER,

    // the related chart id
    chart_id: SQ.STRING(5),

    // current status of the job
    status: SQ.ENUM('queued', 'in_progress', 'done', 'failed'),

    // when was the job created
    created_at: SQ.DATE,

    // when was the status changed from queued to in_progress
    processed_at: SQ.DATE,

    // when was the status changed to done or failed
    done_at: SQ.DATE,

    // the index of the last task the client has worked on
    last_task: SQ.INTEGER,

    // the task list
    tasks: SQ.JSON,

    // a log file with debug and error messages from the client
    log: SQ.JSON
}, {
    timestamps: false,
    tableName: 'export_job'
});

module.exports = ExportJob;
