const ORM = require('../index');
const config = require('./config');
ORM.init(config);

const {AccessToken} = require('../models');

(async () => {
    const token = await AccessToken.newToken({user_id: 29, type: 'api', data: {comment:'yay'}});

    console.log(token.toJSON());

    const rows = await AccessToken.findAll({limit:20});


    rows.forEach(row => console.log(row.toJSON()));

    console.log(rows.length);

    // const user = await rows[1].getUser();
    // console.log(user.toJSON());
    // await AccessToken.create({ metric: 'random number', value: Math.random()*1000 });

    await ORM.db.close();
})();

