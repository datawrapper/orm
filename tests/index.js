const ORM = require('../index');
const {Op} = require('sequelize');
const config = require('./config');

ORM.init(config);

const {Chart, ExportJob, Folder, Team, User} = require('../models');

// Chart.findAll({
//     include: [{model:Folder}],
//     where: {
//         in_folder: {
//             [Op.ne]: null
//         }
//     }
// }).then(charts => {
//     charts.slice(0,10).forEach(f => {
//         console.log(f.id, f.folder.toJSON());
//     })
// });


User.findAll({limit:10}).then(rows => {
    rows.forEach(r => {
        console.log(r.toJSON());
        // console.log(f.name, f.team ? f.team.toJSON() : null);
    })
});

// Team.findAll().then(folders => {
//     folders.forEach(f => {
//         console.log(f.toJSON());
//     })
// });

setTimeout(() => {
    ORM.db.close();
}, 3000);
