const ORM = require('../index');
const {Op} = require('sequelize');
const config = require('./config');

ORM.init(config);


const {Chart, ExportJob, Folder, Team, User, Theme} = require('../models');

User.findOne({where:{email:'gka@vis4.net'}}).then(me => {
    // for (var k in me) {
    //     console.log(k);
    // }
    console.log(me.toJSON());
    me.getThemes({limit:10}).then(rows => {
        console.log('themes -->', rows.map(c => c.id));
        rows[0].getUsers().then(r => {
            console.log('   users --> ', r.map(c =>c.id));
        })
    })
});

// Chart.findAll({
//     include: [{model:Folder}],
//     where: { forked_from: {[Op.ne]: null} }
// }).then(charts => {
//     charts.slice(0,10).forEach(f => {
//         console.log(f.id, f.folder.toJSON());
//     })
// });


// Chart.findAll({limit:10, where: { forked_from: {[Op.ne]: null} }}).then(rows => {
// Chart.findAll({limit:10}).then(rows => {
//     for (var k in rows[0]) {
//         console.log(k);
//     }
//     // rows.forEach(r => {
//     //     console.log(r.toJSON());
//     //     // console.log(f.name, f.team ? f.team.toJSON() : null);
//     // })
// });

// ExportJob.findAll({limit:10}).then(rows => {
//      rows.forEach(f => {
//         console.log(f.toJSON());
//      })
// });


setTimeout(() => {
    ORM.db.close();
}, 3000);
