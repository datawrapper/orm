const ORM = require('../index');
const config = require('./config');
ORM.init(config);

const {User, UserData} = require('../models');

(async () => {
    const rows = await UserData.findAll({limit:2});

    rows.forEach(row => console.log(row.toJSON()));

    // const p = await rows[0].getUser();
    const p = await User.findById(29);
    console.log(p.toJSON());
    const pd = await p.getUserData();
    // console.log(pd.map(p => `${p.key} --> ${p.data}`).join('\n'));

    // const x = await p.getUserDatum();
    // console.log(x);
    for (let k in p) {
    	if (typeof p[k] == 'function') {
    		console.log(k);
    	}
    }
    // const user = await rows[1].getUser();
    // console.log(user.toJSON());
    // // await Stats.create({ metric: 'random number', value: Math.random()*1000 });

    await ORM.db.close();
})();

