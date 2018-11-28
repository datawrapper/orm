const ORM = require('../index');
const config = require('./config');
ORM.init(config);

const {Stats} = require('../models');

(async () => {
    const rows = await Stats.findAll({limit:10, order: [['time', 'DESC']]});

    rows.forEach(row => console.log(row.toJSON()));

    await Stats.create({ metric: 'random number', value: Math.random()*1000 });

    await ORM.db.close();
})();

