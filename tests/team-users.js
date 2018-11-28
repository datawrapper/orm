const ORM = require('../index');
const config = require('./config');
ORM.init(config);

const {Team} = require('../models');


Team.findAll({limit:10}).then(teams => {
    teams.forEach(team => {
        team.getUsers().then(users => {
            console.log(team.name, users.map(u => u.email));
            ORM.db.close();
        });
    })
});
