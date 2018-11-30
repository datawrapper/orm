const ORM = require('../index');
const config = require('./config');
ORM.init(config);

const {Plugin, } = require('../models');

(async () => {
    const plugin = await Plugin.findByPk('export-pdf');

    const products = await plugin.getProducts();

    products.forEach(d => console.log(d.toJSON()));

    const plugins = await products[0].getPlugins();

    plugins.forEach(d => console.log(d.toJSON()));

    // const user = await rows[1].getUser();
    // console.log(user.toJSON());
    // // await Stats.create({ metric: 'random number', value: Math.random()*1000 });

    await ORM.db.close();
})();

