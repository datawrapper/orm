const ORM = require('../index');
const config = require('./config');
ORM.init(config);

const { Plugin } = require('../models');

(async () => {
    // await Plugin.register('orm', ['test-plugin']);

    //    let pd = await PluginData.findAll({where: {key:'installed_by'}});

    //    console.log('before pd', pd.length);

    // pd = await PluginData.findAll({where: {key:'installed_by'}});

    //    console.log('after pd', pd.length);

    // await Plugin.register('orm', ['mooo', 'test-plugin']);
    // pd = await PluginData.findAll({where: {key:'installed_by'}});

    //    console.log('after pd', pd.length);

    //    await Plugin.register('orm', []);
    //    pd = await PluginData.findAll({where: {key:'installed_by'}});

    //    console.log('after pd', pd.length);

    //    // pd.forEach(d => console.log(d5.toJSON()));
    // await Plugin.register('api', ['z-test-plugin']);
    await Plugin.register('orm', []);

    // console.log( (await Plugin.findAll()).map(p => p.id));

    // await Plugin.register('orm', []);

    // console.log( (await Plugin.findAll()).map(p => p.id));

    await ORM.db.close();
})();
