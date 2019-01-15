const models = require('./models');

Object.keys(models).forEach(k => {
    models[k].sync();
});
