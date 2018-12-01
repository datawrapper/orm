const ORM = require('../index');
const config = require('./config');
ORM.init(config);

const {User} = require('../models');

(async () => {
    const user = await User.findByPk(29);

    const allow = await user.mayUsePlugin('export-pdf');

    console.log('may use?', allow);

    const plugins = await user.getPlugins();

    console.log(plugins.map(d => d.id).join(', '));

    // plugins.forEach(p => {
    // 	console.log(p.id, p.is_private, p.enabled);
    // })

    setTimeout(() => {
    	ORM.db.close();
    }, 200);
})();

