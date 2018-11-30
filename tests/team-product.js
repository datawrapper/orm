const ORM = require('../index');
const config = require('./config');
ORM.init(config);

const {Team} = require('../models');


Team.findAll({limit:10}).then(teams => {
    teams.forEach(team => {
        team.getProducts().then(prod => {
            console.log(team.name, prod.map(u => u.id));
            ORM.db.close();
        });
    })
});
