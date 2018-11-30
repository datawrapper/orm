const ORM = require('../index');
const config = require('./config');
ORM.init(config);

const {AuthToken} = require('../models');

(async () => {
    const token = await AuthToken.newToken({user_id: 29, comment:'this is another one'});

    console.log(token.toJSON());

    const rows = await AuthToken.findAll({limit:20});

    rows.forEach(row => console.log(row.toJSON()));

    const user = await rows[0].getUser();
    console.log(user.toJSON());


    // const user = await rows[1].getUser();
    // await AccessToken.create({ metric: 'random number', value: Math.random()*1000 });

    await ORM.db.close();
})();

