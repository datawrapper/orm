const ORM = require('../index');
const config = require('./config');
ORM.init(config);

const {Plugin, PluginData} = require('../models');

(async () => {
    const rows = await Plugin.findAll();

    const plugins = rows.map(p => p.id)
    console.log(plugins);

    await PluginData.bulkCreate(plugins.map(p => {
    	return { plugin_id:p, key: 'installed_at', data: 'core' };
    }))

    // const user = await rows[1].getUser();
    // console.log(user.toJSON());
    // // await Stats.create({ metric: 'random number', value: Math.random()*1000 });

    await ORM.db.close();
})();

