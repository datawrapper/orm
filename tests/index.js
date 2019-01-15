const ORM = require('../index');
const config = require('./config');

ORM.init(config);

module.exports = {
    close () {
        setTimeout(() => {
            ORM.db.close();
        }, 100);
    }
};
