const User = require('../User');
const Theme = require('../Theme');

User.belongsToMany(Theme, {
    through: 'user_theme',
    timestamps: false
});

Theme.belongsToMany(User, {
    through: 'user_theme',
    timestamps: false
});
