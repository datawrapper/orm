const ORM = require('../index');
const config = require('./config');
ORM.init(config);

const {User, Product} = require('../models');

(async () => {

    const user = await User.findByPk(29);

    let products = await user.getProducts();
    products.forEach(p => console.log(p.toJSON()));

    p = await Product.findOne();

    const users = await p.getUsers();

    // await user.addProduct(p);

    // products = await user.getProducts();
    users.forEach(p => console.log(p.toJSON()));

    // console.log(user.role);

    // const teams = await user.getTeams();

    // const team_chart = await teams[0].getCharts();

    // for (let tc of team_chart) {
    // 	if (tc.author_id != user.id) {
	   //  	// console.log(tc.id, tc.title, tc.author_id, tc.organization_id);
	   //  	const canEdit = await user.canEditChart(tc);
	   //  	console.log(canEdit ? 'y' : 'n');
    // 	}
    // }

    await ORM.db.close();
})();

