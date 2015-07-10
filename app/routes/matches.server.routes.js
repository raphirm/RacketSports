'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var matches = require('../../app/controllers/matches.server.controller');

	// Matches Routes
	app.route('/matches')
		.get(users.requiresLogin, matches.list)
		.post(users.requiresLogin, matches.create);
	app.route('/matches/new')
		.get(users.requiresLogin, matches.listNew);
	app.route('/matches/open')
		.get(users.requiresLogin, matches.listOpen);
	app.route('/matches/proposed')
		.get(users.requiresLogin, matches.listChange);
	app.route('/matches/inProgress')
		.get(users.requiresLogin, matches.listInProgress);
	app.route('/matches/r2c')
		.get(users.requiresLogin, matches.rtwoc);
	app.route('/matches/done')
		.get(users.requiresLogin, matches.listDone);
	app.route('/matches/broadcasts')
		.get(users.requiresLogin, matches.listBroadcasts);
	app.route('/matches/:matchId')
		.get(matches.read)
		.put(users.requiresLogin, matches.hasAuthorization, matches.update)
		.delete(users.requiresLogin, matches.hasAuthorization, matches.delete);

	// Finish by binding the Match middleware
	app.param('matchId', matches.matchByID);

};
