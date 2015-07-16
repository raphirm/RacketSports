'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Match = mongoose.model('Match'),
	League = mongoose.model('League'),
	UserToPoints = mongoose.model('UserToPoints'),
	User = mongoose.model('User'),
	Court = mongoose.model('Court'),
	_ = require('lodash');

/**
 * Create a Match
 */
exports.create = function(req, res) {
	var match = new Match();
	if (req.body.spieler[1]) {
		User.findOne(req.body.spieler[1].user, function (err, spieler) {
			match.spieler.push({user: req.user});
			match.spieler.push({user: spieler});
			Court.findOne(req.body.court, function (err, court) {
				match.court = court;
				match.proposedTimes = req.body.proposedTimes;
				match.sport = req.body.sport;
				match.state = req.body.state;
				match.propBy = req.user;
				if(req.body.schedule){
					match.schedule = req.body.schedule;
				}
				if(req.body.league){
					match.league = req.body.league._id
				}
				match.save(function (err) {
					if (err) {
						console.log(err);
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(match);
					}
				});
			});
		});
	}else{
		match.spieler.push({user: req.user});
		Court.findOne(req.body.court, function (err, court) {
			match.court = court;
			match.sport = req.body.sport;
			match.time = req.body.time;
			match.state = req.body.state;
			match.propBy = req.user;
			match.save(function (err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(match);
				}
			});
		});
	}



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
	if(req.body.state == 'done'){
		Match.findById(req.match._id).populate('spieler.user court propsedTimes league').exec(function(err, match) {
			if(req.body.schedule ) {
				var newMatch = new Match();
				newMatch.spieler.push({user: match.spieler[0].user});
				newMatch.spieler.push({user: match.spieler[1].user});
				newMatch.court = match.court;
				newMatch.sport = match.sport;
				if(match.schedule){
					newMatch.schedule = match.schedule;
				}
				if(match.league){
					newMatch.league = match.league;
				}
				newMatch.state = 'open';
				if (match.schedule == 'weekly') {
					newMatch.time = new Date(match.time.getTime() + 604800000);
				}
				if (match.schedule == 'daily') {
					newMatch.time = new Date(match.time.getTime() + 86400000);
				}
				if (match.schedule == 'monthly') {
					newMatch.time = new Date(match.time.setMonth(match.time.getMonth() + 1));
				}

				newMatch.save();
			}
			if(req.body.league) {
				League.findById(req.body.league).populate('users').exec(function (err, league) {
					UserToPoints.populate(league.users, {path: 'user', select: 'username'}, function (err, user) {
						var winner = '';
						var looser = '';
						if (match.spieler[0].outcome == 'win') {
							winner = match.spieler[0].user;
							looser = match.spieler[1].user;
						} else {
							winner = match.spieler[1].user;
							looser = match.spieler[0].user;

						}

						league["users"].forEach(function (usertopoint) {
							if (usertopoint.user.id == winner.id) {
								console.log("Found winner: " + usertopoint);
								usertopoint.wins++;
								usertopoint.points = usertopoint.points + 3;
								usertopoint.save(function (err) {
									if (err) {
										console.log(err);
										return res.status(400).send({
											message: errorHandler.getErrorMessage(err)
										});
									} else {

									}
								});
							}
							if (usertopoint.user.id == looser.id) {
								console.log("Found looser: " + usertopoint);

								usertopoint.loss++;
								usertopoint.save(function (err) {
									if (err) {
										console.log(err);
										return res.status(400).send({
											message: errorHandler.getErrorMessage(err)
										});
									} else {

									}
								});
							}

						});
					});

				});
			}
		});
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
exports.listBroadcasts =  function(req, res){
	Match.find({state: 'new', "spieler.1.user" : { $exists: false }, court: {$in : req.user.courts}, propBy: { $ne: req.user}}).sort('-created').populate('spieler court').exec(function(err, matches){
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

};
