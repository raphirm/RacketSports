'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	app = require('../../server'),

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
				"description": "Bla",
				"enddate": "2015-07-14T12:25:46.790Z",
				"gender": "mixed",
				"lat": 48.245015,
				"lng": 10.36567500000001,
				"matches": [],
				"name": "Cooli Liga",
				"niveau": 3,
				"ort": "Karl-Mantel-Straße 41, 86381 Krumbach (Schwaben), Germany",
				"price": "none",
				"private": false,
				"rules": "Ein Match alle zwei Wochen, autogeneriert, win 3 Punkte, unentschieden 1 Punkt, verlieren: 0 Punkte",
				"sport": "Tennis",
				"startdate": "2015-07-14T12:25:46.790Z",
				"users": usertopoints,
				"user": user
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
