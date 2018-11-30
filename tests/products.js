const ORM = require('../index');
const config = require('./config');
ORM.init(config);

const {Product} = require('../models');

(async () => {
    const rows = await Product.findAll({limit:3});

    rows.forEach(row => console.log(row.toJSON()));

    await ORM.db.close();
})();

