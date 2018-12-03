const ORM = require('../index');
const config = require('./config');
ORM.init(config);

const {ChartAccessToken} = require('../models');

(async () => {
    const token = await ChartAccessToken.newToken({chart_id: 'nhgOF'});

    console.log(token.toJSON());

    const rows = await ChartAccessToken.findAll({limit:5});


    rows.forEach(row => console.log(row.toJSON()));

    console.log(rows.length);

    // const user = await rows[1].getUser();
    // console.log(user.toJSON());
    // await AccessToken.create({ metric: 'random number', value: Math.random()*1000 });

    await ORM.db.close();
})();

