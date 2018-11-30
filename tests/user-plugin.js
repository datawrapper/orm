const ORM = require('../index');
const config = require('./config');
ORM.init(config);

const {User} = require('../models');

(async () => {
    const user = await User.findByPk(29);

    const allow = await user.mayUsePlugin('export-pdf');

    console.log(allow);

    setTimeout(() => {
    	ORM.db.close();
    }, 200);
})();

