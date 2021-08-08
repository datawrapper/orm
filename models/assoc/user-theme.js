const User = require('../User');
const Theme = require('../Theme');

// every theme must have an owner
Theme.belongsTo(User, { foreignKey: 'owner_id' });

// users can have (read) access to many themes
User.belongsToMany(Theme, {
    through: 'user_theme',
    timestamps: false
});

// themes can be readable by many users
Theme.belongsToMany(User, {
    through: 'user_theme',
    timestamps: false
});
