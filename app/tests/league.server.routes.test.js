'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	League = mongoose.model('League'),
	UserToPoints = mongoose.model('UserToPoints'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, league, usertopoints;

/**
 * League routes tests
 */
describe('League CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		usertopoints = new UserToPoints({
			user: user
		});



		user.save(function() {
			usertopoints.save(function() {
			league = new League({
				name: 'League Name',
				users: usertopoints,
				sport: "Squash"
			});

			});
					done();

		});

	});

	it('should be able to save League instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = usertopoints.id;

				// Save a new League
				agent.post('/leagues')
					.send(league)
					.expect(200)
					.end(function(leagueSaveErr, leagueSaveRes) {
						// Handle League save error
						if (leagueSaveErr) done(leagueSaveErr);

						// Get a list of Leagues
						agent.get('/leagues')
							.end(function(leaguesGetErr, leaguesGetRes) {
								// Handle League save error
								if (leaguesGetErr) done(leaguesGetErr);

								// Get Leagues list
								var leagues = leaguesGetRes.body;

								// Set assertions
								(leagues[0].users[0]._id).should.equal(userId);
								(leagues[0].name).should.match('League Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save League instance if not logged in', function(done) {
		agent.post('/leagues')
			.send(league)
			.expect(401)
			.end(function(leagueSaveErr, leagueSaveRes) {
				// Call the assertion callback
				done(leagueSaveErr);
			});
	});

	it('should not be able to save League instance if no name is provided', function(done) {
		// Invalidate name field

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;
				league.name = '';
				// Save a new League
				agent.post('/leagues')
					.send(league)
					.expect(400)
					.end(function(leagueSaveErr, leagueSaveRes) {
						// Set message assertion

						(leagueSaveRes.body.message).should.match('Please fill League name');
						
						// Handle League save error
						done(leagueSaveErr);
					});
			});
	});

	it('should be able to update League instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new League
				agent.post('/leagues')
					.send(league)
					.expect(200)
					.end(function(leagueSaveErr, leagueSaveRes) {
						// Handle League save error
						if (leagueSaveErr) done(leagueSaveErr);

						// Update League name
						league.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing League
						agent.put('/leagues/' + leagueSaveRes.body._id)
							.send(league)
							.expect(200)
							.end(function(leagueUpdateErr, leagueUpdateRes) {
								// Handle League update error
								if (leagueUpdateErr) done(leagueUpdateErr);

								// Set assertions
								(leagueUpdateRes.body._id).should.equal(leagueSaveRes.body._id);
								(leagueUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Leagues if not signed in', function(done) {
		// Create new League model instance
		var leagueObj = new League(league);

		// Save the League
		leagueObj.save(function() {
			// Request Leagues
			request(app).get('/leagues')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single League if not signed in', function(done) {
		// Create new League model instance
		var leagueObj = new League(league);

		// Save the League
		leagueObj.save(function() {
			request(app).get('/leagues/' + leagueObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', league.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete League instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new League
				agent.post('/leagues')
					.send(league)
					.expect(200)
					.end(function(leagueSaveErr, leagueSaveRes) {
						// Handle League save error
						if (leagueSaveErr) done(leagueSaveErr);

						// Delete existing League
						agent.delete('/leagues/' + leagueSaveRes.body._id)
							.send(league)
							.expect(200)
							.end(function(leagueDeleteErr, leagueDeleteRes) {
								// Handle League error error
								if (leagueDeleteErr) done(leagueDeleteErr);

								// Set assertions
								(leagueDeleteRes.body._id).should.equal(leagueSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete League instance if not signed in', function(done) {
		// Set League user 
		league.user = user;

		// Create new League model instance
		var leagueObj = new League(league);

		// Save the League
		leagueObj.save(function() {
			// Try deleting League
			request(app).delete('/leagues/' + leagueObj._id)
			.expect(401)
			.end(function(leagueDeleteErr, leagueDeleteRes) {
				// Set message assertion
				(leagueDeleteRes.body.message).should.match('User is not logged in');

				// Handle League error error
				done(leagueDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		League.remove().exec();
		done();
	});
});
