'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	League = mongoose.model('League'),
	UserToPoints = mongoose.model('UserToPoints');

/**
 * Globals
 */
var user, league, usertopoints;

/**
 * Unit tests
 */
describe('League Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});
		usertopoints = new UserToPoints({
			user: user
		});
		user.save(function() {
			usertopoints
		});

		user.save(function() {
			league = new League({
				name: 'League Name',
				users: usertopoints,
				sport: 'Squash'
			});
			done();
		});



	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return league.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			league.name = '';

			return league.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		League.remove().exec();
		User.remove().exec();

		done();
	});
});
