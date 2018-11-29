const ORM = require('../index');
const config = require('./config');
ORM.init(config);

const {Action} = require('../models');

(async () => {
    const rows = await Action.findAll({limit:20, order: [['action_time', 'DESC']]});

    rows.forEach(row => console.log(row.toJSON()));

    const user = await rows[1].getUser();
    console.log(user.toJSON());
    // await Stats.create({ metric: 'random number', value: Math.random()*1000 });

    await ORM.db.close();
})();
