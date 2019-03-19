const ORM = require('../index');
const config = require('./config');

const test = {
    init() {
        return ORM.init(config);
    },
    close() {
        setTimeout(() => {
            ORM.db.close();
        }, 100);
    }
};

module.exports = test;
