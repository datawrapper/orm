const ORM = require('../index');
const config = require('./config');
ORM.init(config);

const {Plugin, PluginData} = require('../models');

(async () => {
    const rows = await PluginData.findAll({limit:2});

    rows.forEach(row => console.log(row.toJSON()));

    // const p = await rows[0].getPlugin();
    const p = await Plugin.findById('publish-s3');
    console.log(p.toJSON());
    const pd = await p.getPluginData();
    console.log(pd.map(p => `${p.key} --> ${p.data}`).join('\n'));
    // for (let k in p) {
    // 	if (typeof p[k] == 'function') {
    // 		console.log(k);
    // 	}
    // }
    // const user = await rows[1].getUser();
    // console.log(user.toJSON());
    // // await Stats.create({ metric: 'random number', value: Math.random()*1000 });

    await ORM.db.close();
})();

