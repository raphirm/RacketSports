'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Court = mongoose.model('Court'),
	_ = require('lodash');

/**
 * Create a Court
 */
exports.create = function(req, res) {
	var court = new Court(req.body);
	court.user = req.user;

	court.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(court);
		}
	});
};

/**
 * Show the current Court
 */
exports.read = function(req, res) {
	res.jsonp(req.court);
};

/**
 * Update a Court
 */
exports.update = function(req, res) {
	var court = req.court ;

	court = _.extend(court , req.body);

	court.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(court);
		}
	});
};

/**
 * Delete an Court
 */
exports.delete = function(req, res) {
	var court = req.court ;
		court.remove(function (err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(court);
			}
		});

};

/**
 * List of Courts
 */
exports.list = function(req, res) { 
	Court.find().sort('-created').populate('user', 'displayName').exec(function(err, courts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(courts);
		}
	});
};

/**
 * Court middleware
 */
exports.courtByID = function(req, res, next, id) { 
	Court.findById(id).populate('user', 'displayName').exec(function(err, court) {
		if (err) return next(err);
		if (! court) return next(new Error('Failed to load Court ' + id));
		req.court = court ;
		next();
	});
};

/**
 * Court authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.court.user.id !== req.user.id || !req.user.roles.indexOf('admin')) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
