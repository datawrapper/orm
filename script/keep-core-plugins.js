const ORM = require('../index');
const config = require('./config');
ORM.init(config);

const { Plugin } = require('../models');

(async () => {
    const rows = await Plugin.findAll();
    const plugins = rows.map(p => p.id);

    await Plugin.register('core', plugins);

    await ORM.db.close();
})();
