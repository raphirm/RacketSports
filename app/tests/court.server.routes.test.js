'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Court = mongoose.model('Court'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, court;

/**
 * Court routes tests
 */
describe('Court CRUD tests', function() {
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

		// Save a user to the test db and create new Court
		user.save(function() {
			court = {
				'name':'Vitis', 'lat' : '47.400084', 'lng' : '8.444892999999979','address':'Vitis','contact':'0795769266','sports':['Squash','Tennis','Badminton','Tabletennis']
			};

			done();
		});
	});

	it('should be able to save Court instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Court
				agent.post('/courts')
					.send(court)
					.expect(200)
					.end(function(courtSaveErr, courtSaveRes) {
						// Handle Court save error
						if (courtSaveErr) done(courtSaveErr);

						// Get a list of Courts
						agent.get('/courts')
							.end(function(courtsGetErr, courtsGetRes) {
								// Handle Court save error
								if (courtsGetErr) done(courtsGetErr);

								// Get Courts list
								var courts = courtsGetRes.body;

								// Set assertions
								(courts[0].user._id).should.equal(userId);
								(courts[0].name).should.match('Vitis');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Court instance if not logged in', function(done) {
		agent.post('/courts')
			.send(court)
			.expect(401)
			.end(function(courtSaveErr, courtSaveRes) {
				// Call the assertion callback
				done(courtSaveErr);
			});
	});

	it('should not be able to save Court instance if no name is provided', function(done) {
		// Invalidate name field
		court.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Court
				agent.post('/courts')
					.send(court)
					.expect(400)
					.end(function(courtSaveErr, courtSaveRes) {
						// Set message assertion
						(courtSaveRes.body.message).should.match('Please fill Court name');
						
						// Handle Court save error
						done(courtSaveErr);
					});
			});
	});

	it('should be able to update Court instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Court
				agent.post('/courts')
					.send(court)
					.expect(200)
					.end(function(courtSaveErr, courtSaveRes) {
						// Handle Court save error
						if (courtSaveErr) done(courtSaveErr);

						// Update Court name
						court.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Court
						agent.put('/courts/' + courtSaveRes.body._id)
							.send(court)
							.expect(200)
							.end(function(courtUpdateErr, courtUpdateRes) {
								// Handle Court update error
								if (courtUpdateErr) done(courtUpdateErr);

								// Set assertions
								(courtUpdateRes.body._id).should.equal(courtSaveRes.body._id);
								(courtUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Courts if not signed in', function(done) {
		// Create new Court model instance
		var courtObj = new Court(court);

		// Save the Court
		courtObj.save(function() {
			// Request Courts
			request(app).get('/courts')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Court if not signed in', function(done) {
		// Create new Court model instance
		var courtObj = new Court(court);

		// Save the Court
		courtObj.save(function() {
			request(app).get('/courts/' + courtObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', court.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Court instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Court
				agent.post('/courts')
					.send(court)
					.expect(200)
					.end(function(courtSaveErr, courtSaveRes) {
						// Handle Court save error
						if (courtSaveErr) done(courtSaveErr);

						// Delete existing Court
						agent.delete('/courts/' + courtSaveRes.body._id)
							.send(court)
							.expect(200)
							.end(function(courtDeleteErr, courtDeleteRes) {
								// Handle Court error error
								if (courtDeleteErr) done(courtDeleteErr);

								// Set assertions
								(courtDeleteRes.body._id).should.equal(courtSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Court instance if not signed in', function(done) {
		// Set Court user 
		court.user = user;

		// Create new Court model instance
		var courtObj = new Court(court);

		// Save the Court
		courtObj.save(function() {
			// Try deleting Court
			request(app).delete('/courts/' + courtObj._id)
			.expect(401)
			.end(function(courtDeleteErr, courtDeleteRes) {
				// Set message assertion
				(courtDeleteRes.body.message).should.match('User is not logged in');

				// Handle Court error error
				done(courtDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Court.remove().exec();
		done();
	});
});
