const ORM = require('../index');
const config = require('./config');
ORM.init(config);

const {User} = require('../models');


User.findOne({where:{email:'gka@vis4.net'}}).then(me => {
    console.log(me.toJSON());
    me.getThemes({limit:10}).then(rows => {
        console.log('themes -->', rows.map(c => c.id));
        rows[0].getUsers().then(r => {
            console.log('   users --> ', r.map(c =>c.id));
            ORM.db.close();
        });
    });
});
