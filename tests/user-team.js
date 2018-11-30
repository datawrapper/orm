const ORM = require('../index');
const config = require('./config');
ORM.init(config);

const {User, Team} = require('../models');

(async () => {
    const user = await User.findByPk(29);

    const t = await user.hasTeam('21-minuten');
    console.log(user.role);

    const teams = await user.getTeams();

    const team_chart = await teams[0].getCharts();

    for (let tc of team_chart) {
    	if (tc.author_id != user.id) {
	    	// console.log(tc.id, tc.title, tc.author_id, tc.organization_id);
	    	const canEdit = await user.canEditChart(tc);
	    	console.log(canEdit ? 'y' : 'n');
    	}
    }

    await ORM.db.close();
})();

