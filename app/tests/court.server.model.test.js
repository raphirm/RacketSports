'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	app = require('../../server'),

	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Court = mongoose.model('Court');

/**
 * Globals
 */
var user, court;

/**
 * Unit tests
 */
describe('Court Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			court = new Court({
				'name':'Vitis', 'lat' : '47.400084', 'lng' : '8.444892999999979','address':'Vitis','contact':'0795769266','sports':['Squash','Tennis','Badminton','Tabletennis'],
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return court.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			court.name = '';

			return court.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('should be able to show an error when try to save without coordinates', function(done) {
			court.lat = '';

			return court.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Court.remove().exec();
		User.remove().exec();

		done();
	});
});
