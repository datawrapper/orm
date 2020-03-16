const ORM = require('../index');
const { requireConfig } = require('@datawrapper/shared/node/findConfig');

const config = requireConfig();

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
