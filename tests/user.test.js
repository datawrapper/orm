const test = require('ava');
const { close } = require('./index');
const { User } = require('../models');

test('get user 1', async t => {
    const user = await User.findByPk(1);
    t.is(user.email, 'ci@datawrapper.de');
    close();
});
