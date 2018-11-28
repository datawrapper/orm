const ORM = require('../index');
const config = require('./config');
ORM.init(config);

const {Folder} = require('../models');

Folder.findAll({limit:20}).then(rows => {
    rows.forEach(f => {
        // console.log(f.toJSON());
        f.getParent().then(parent => {
            if (parent) console.log(f.name, ' --(has parent)-->', parent.name);

            f.getChildren().then(children => {
                if (children) console.log('   ',f.name, ' --(has children)-->', children.map(c => c.name));
                ORM.db.close();
            });
        });
    })
});
