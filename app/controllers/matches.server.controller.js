'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Match = mongoose.model('Match'),
	User = mongoose.model('User'),
	Court = mongoose.model('Court'),
	_ = require('lodash');

/**
 * Create a Match
 */
exports.create = function(req, res) {
	var match = new Match();
	console.log(req.body.spieler[1].user);
	User.findOne(req.body.spieler[1].user, function(err, spieler){
		match.spieler.push({user: req.user});
		match.spieler.push({user: spieler});
		Court.findOne(req.body.court, function(err, court){
			match.court = court;

			match.sport = req.body.sport;
			match.save(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(match);
				}
			});
		});
	});



};

/**
 * Show the current Match
 */
exports.read = function(req, res) {
	res.jsonp(req.match);
};

/**
 * Update a Match
 */
exports.update = function(req, res) {
	var match = req.match ;

	match = _.extend(match , req.body);

	match.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(match);
		}
	});
};

/**
 * Delete an Match
 */
exports.delete = function(req, res) {
	var match = req.match ;

	match.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(match);
		}
	});
};

/**
 * List of Matches
 */
exports.list = function(req, res) { 
	Match.find().sort('-created').populate('spieler court').exec(function(err, matches) {
		User.populate(matches, {path: 'spieler.user'}, function (err, user) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(matches);
			}
		});
	});
};

/**
 * Match middleware
 */
exports.matchByID = function(req, res, next, id) { 
	Match.findById(id).populate('user', 'displayName').exec(function(err, match) {
		if (err) return next(err);
		if (! match) return next(new Error('Failed to load Match ' + id));
		req.match = match ;
		next();
	});
};

/**
 * Match authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.match.user.indexOf(req.user)>-1) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
