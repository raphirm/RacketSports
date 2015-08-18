'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var leagues = require('../../app/controllers/leagues.server.controller');

	// Leagues Routes
	app.route('/leagues')
		.get(leagues.list)
		.post(users.requiresLogin, leagues.create);
    app.route('/leagues/me')
        .get(users.requiresLogin, leagues.listMyLeagues);
	app.route('/leagues/requests')
		.get(users.requiresLogin, leagues.listMyLeagueRequests);
	app.route('/leagues/:leagueId')
		.get(leagues.read)
		.put(users.requiresLogin, leagues.hasAuthorization, leagues.update)
		.delete(users.requiresLogin, leagues.hasAuthorization, leagues.delete);
	app.route('/leagues/:leagueId/join')
		.get(users.requiresLogin, leagues.hasAuthorization, leagues.join);
	app.route('/leagues/:leagueId/leave')
		.get(users.requiresLogin, leagues.hasAuthorization, leagues.leave);
	app.route('/leagues/:leagueId/decline')
		.get(users.requiresLogin, leagues.hasAuthorization, leagues.decline);
	app.route('/leagues/:leagueId/invite')
		.post(users.requiresLogin, leagues.hasAuthorization, leagues.invite);
	// Finish by binding the League middleware
	app.param('leagueId', leagues.leagueByID);
};
