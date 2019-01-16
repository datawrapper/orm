const ORM = require('../index');
const config = require('./config');

ORM.init(config);

const models = require('../models/index');

module.exports = {
    close () {
        setTimeout(() => {
            ORM.db.close();
        }, 100);
    },
    models
};
