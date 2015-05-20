'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var courts = require('../../app/controllers/courts.server.controller');

	// Courts Routes
	app.route('/courts')
		.get(courts.list)
		.post(users.requiresLogin, courts.create);

	app.route('/courts/:courtId')
		.get(courts.read)
		.put(users.requiresLogin, courts.hasAuthorization, courts.update)
		.delete(users.requiresLogin, courts.hasAuthorization, courts.delete);
	app.route('/courts/:courtId/join')
		.get(users.requiresLogin, courts.join);
	app.route('/courts/:courtId/leave')
		.get(users.requiresLogin, courts.leave);
	// Finish by binding the Court middleware
	app.param('courtId', courts.courtByID);
};
