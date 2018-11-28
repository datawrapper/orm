const ORM = require('../index');
const config = require('./config');
ORM.init(config);

const {User} = require('../models');


User.findOne({where:{email:'gka@vis4.net'}}).then(me => {
    console.log('USER', me.toJSON());
    me.getFolders({limit:10}).then(rows => {
        console.log('\n  has folders -->', rows.map(c => c.id));
        rows[0].getUser().then(user => {
            console.log(`\n    folder ${rows[0].id}'s owner is --> `, user.email);
            ORM.db.close();
        });
    });
});
