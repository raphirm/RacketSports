'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {
	User.findOne({'username' : req.user.username}).populate('friends friendrequests').exec(function(err, user){
			res.json(user || null);
		}

	)

};
exports.removeFriend = function(req, res, next) {
	var user = req.user;
	var provider = req.param('friend');
	if (user && provider) {
		//delete friend
		User.findOne({'username' : provider}).populate('friends').exec(function(err, friend) {
			console.log("Deleting Friend with username: " + provider);
			if (user.friends.indexOf(friend._id)>=0) {
				var fid = user.friends.indexOf(friend._id);
				var uid = friend.friends.indexOf(user._id);
				console.log("Index of Friend: " +fid)
				user.friends.splice(fid, 1);
				friend.friends.splice(uid, 1);
				friend.hookEnabled = false;
				friend.save();
				user.markModified('friends');
			}
			user.save(function (err) {

				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					req.login(user, function (err) {
						if (err) {
							res.status(400).send(err);
						} else {
							res.json(user);
						}
					});
				}
			});
		});
	}

};
exports.removeRequest = function(req, res, next) {
	var user = req.user;
	var provider = req.param('friend');
	if (user && provider) {
		//delete friend
		User.findOne({'username' : provider}).populate('friends').exec(function(err, friend) {
			console.log("Deleting Friend with username: " + provider);
			if (user.friendrequests.indexOf(friend._id)>=0) {
				var fid = user.friendrequests.indexOf(friend._id);
				console.log("Index of Friend: " +fid)
				user.friendrequests.splice(fid, 1);
				user.markModified('friends');
			}
			user.save(function (err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					req.login(user, function (err) {
						if (err) {
							res.status(400).send(err);
						} else {
							res.json(user);
						}
					});
				}
			});
		});
	}

};

exports.addFriend = function(req, res, next) {
	var user = req.user;
	var provider = req.param('friend');
	if (user) {
		console.log(provider);

		User.findOne({'username': provider}, function (err, friend) {
				if (friend) {
					console.log(user.friends.indexOf(friend));
					if( user.friendrequests.indexOf(friend._id) >= 0 && user.friends.indexOf(friend._id) < 0){
						user.friends.push(friend);
						friend.friends.push(user);
						user.friendrequests.splice(user.friendrequests.indexOf(friend), 1);
						user.save();
						friend.hookEnabled = false;
						friend.save();
						res.json(user);}
					else{
						res.status(400).send('already added');
					}
				}
				else {
					res.status(400).send('user not found');
				}
			});


	}
};
exports.addRequest = function(req, res, next) {
	var user = req.user;
	var provider = req.param('friend');
	if (user) {
		console.log(provider);

		User.findOne({'username': provider}, function (err, friend) {
			if (friend) {
				console.log(user.friends.indexOf(friend));
				if( friend.friendrequests.indexOf(user._id) < 0 && friend.friends.indexOf(user._id) < 0){
					friend.friendrequests.push(user);
					friend.hookEnabled = false;
					friend.save();
					res.json(user);}
				else{
					res.status(400).send('already added');
				}
			}
			else {
				res.status(400).send('user not found');
			}
		});


	}
};
