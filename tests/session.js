const ORM = require('../index');
const config = require('./config');
ORM.init(config);

const {Session} = require('../models');

(async () => {
    const rows = await Session.findAll({order: [['date_created', 'DESC']]});

    rows.forEach(row => {
        // console.log(row.data);
        row.toJSON();
    });

    // await Stats.create({ metric: 'random number', value: Math.random()*1000 });

    await ORM.db.close();
})();

