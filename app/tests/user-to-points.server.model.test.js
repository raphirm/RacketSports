'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	UserToPoints = mongoose.model('UserToPoints');

/**
 * Globals
 */
var user, userToPoints;

/**
 * Unit tests
 */
describe('User to points Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});
		userToPoints = new UserToPoints({
			user: user,
			points: 0,
			winds: 0,
			draws: 0,
			loss: 0
		});
		user.save(function() {


			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return userToPoints.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		UserToPoints.remove().exec();
		User.remove().exec();

		done();
	});
});
