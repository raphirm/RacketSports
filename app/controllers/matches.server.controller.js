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
			match.proposedTimes = req.body.proposedTimes;
			match.sport = req.body.sport;
			match.state = req.body.state;
			match.propBy = req.user;
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
	if(req.body.state == 'r2c'){
		match.r2cBy = req.user;
	}else{
		match.propBy = req.user;
	}

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

	Match.find({'spieler.user': req.user}).sort('-created').populate('spieler court').exec(function(err, matches) {
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
exports.listNew = function(req, res) {
	Match.find({'spieler.user': req.user, state: 'new', propBy: { $ne: req.user}}).sort('-created').populate('spieler court').exec(function(err, matches) {
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
exports.listChange = function(req, res) {
	var user = req.user;
	Match.find({'spieler.user': req.user, state: 'proposed', propBy: { $ne: req.user}}).sort('-created').populate('spieler court').exec(function(err, matches) {
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
exports.listInProgress = function(req, res) {
	var user = req.user;
	Match.find({'spieler.user': req.user, state: 'progress'}).sort('-created').populate('spieler court').exec(function(err, matches) {
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
exports.rtwoc = function(req, res) {
	var user = req.user;
	Match.find({'spieler.user': req.user, state: 'r2c', r2cBy: { $ne: req.user}}).sort('-created').populate('spieler court').exec(function(err, matches) {
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
exports.listOpen = function(req, res) {
	var user = req.user;
	Match.find({'spieler.user': req.user, state: 'open'}).sort('-created').populate('spieler court').exec(function(err, matches) {
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
exports.listDone = function(req, res) {
	var user = req.user;
	Match.find({'spieler.user': req.user, state: 'done'}).sort('-created').populate('spieler court').exec(function(err, matches) {
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
	Match.findById(id).populate('spieler court propsedTimes').exec(function(err, match) {
		User.populate(match, {path: 'spieler.user'}, function (err, user) {

			if (err) return next(err);
			if (!match) return next(new Error('Failed to load Match ' + id));
			req.match = match;
			next();
		});
	});
};

/**
 * Match authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	Match.findById(req.match._id).populate('spieler court propsedTimes').exec(function(err, match) {
		User.populate(match, {path: 'spieler.user'}, function (err, user) {
			console.log(match.r2cBy + req.user._id);

			if (!match) return res.status(404).send('Match not valid');

			if (match.spieler.indexOf(req.user)>-1) {

				return res.status(403).send('User is not authorized');
			}
			if(match.state === 'r2c'&&req.user._id == match.r2cBy){

				return res.status(403).send('User is not authorized');
			}
			else if(req.user._id == match.propBy){
				return res.status(403).send('User is not authorized');
			}
			next()
		});
	});
	;
};
