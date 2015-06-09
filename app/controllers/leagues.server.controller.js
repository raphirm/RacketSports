'use strict';

/**
 * Module dependencies.
 */
    var async = require('async');
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    League = mongoose.model('League'),
    UserToPoints = mongoose.model('UserToPoints'),
    _ = require('lodash');


/**
 * Create a League
 */
exports.create = function (req, res) {
    var league = new League(req.body);
    league.user = req.user;

    league.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(league);
        }
    });
};

/**
 * Show the current League
 */
exports.read = function (req, res) {
    res.jsonp(req.league);
};

/**
 * Update a League
 */
exports.update = function (req, res) {
    var league = req.league;

    league = _.extend(league, req.body);

    league.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(league);
        }
    });
};

/**
 * Delete an League
 */
exports.delete = function (req, res) {
    var league = req.league;

    league.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(league);
        }
    });
};

/**
 * List of Leagues
 */
exports.list = function (req, res) {
    League.find().populate('users').exec(function (err, leagues) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var calls = [];
            leagues.forEach(function (league, index, leagues) {
                calls.push(function(callback) {
                    UserToPoints.populate(league.users, {path: 'user', select: 'username'}, function (err, user) {
                        console.log(user);
                        if (err) return res.jsonp(err);
                        if (!leagues) return res.jsonp(new Error('Failed to load League ' + id));
                        league.users = user;
                        leagues[index] = league;
                        callback()
                    });
                });

                });

            async.parallel(calls, function(err, result){
            console.log(req.user);
                            res.jsonp(leagues)

            });


        }
    });
};
/**
 * List of Leagues
 */
exports.listMyLeagues = function (req, res) {
    League.find().populate('users').exec(function (err, leagues) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var calls = [];
            var myLeagues = [];
            leagues.forEach(function (league, index, leagues) {
                calls.push(function(callback) {
                    UserToPoints.populate(league.users, {path: 'user', select: 'username'}, function (err, user) {
                        if (err) return res.jsonp(err);
                        if (!leagues) return res.jsonp(new Error('Failed to load League ' + id));
                        league.users = user;
                        leagues[index] = league;
                        var filteredLeague=[];
                        if(user.length != 0){
                        filteredLeague= user.filter(function(usr) {

                            return usr.user.username == req.user.username
                        });
                        }
                        if(!(filteredLeague === undefined || filteredLeague.length == 0)){
                            myLeagues.push(league)
                        }
                        callback()
                    });
                });

            });

            async.parallel(calls, function(err, result){

                res.jsonp(myLeagues)

            });


        }
    });
};


/**
 * Join League
 */
exports.join = function (req, res) {
    var league = req.league;
    var user = req.user;
    var userToPoints = new UserToPoints();
    userToPoints.user = req.user;
    userToPoints.save();
    league.users.push(userToPoints);
    league.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(league);
        }
    });
};

/**
 * Join League
 */
exports.leave = function (req, res) {
    var league = req.league;
    var i = league.users.indexOf(req.user);
    league.users.splice(i, 1);
    league.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(league);
        }
    });
};

/**
 * League middleware
 */
exports.leagueByID = function (req, res, next, id) {
    League.findById(id).populate('users').exec(function (err, league) {
        UserToPoints.populate(league.users, {path: 'user', select: 'username'}, function (err, user) {
            if (err) return next(err);
            if (!league) return next(new Error('Failed to load League ' + id));
            console.log(league);
            req.league = league;
            next();
        });
    });
};

/**
 * League authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if ("0" == req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
