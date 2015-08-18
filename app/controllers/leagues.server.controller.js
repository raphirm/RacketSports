'use strict';

/**
 * Module dependencies.
 */
    var async = require('async');
    var Agenda = require('agenda');
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    League = mongoose.model('League'),
    User = mongoose.model('User'),
    config = require('../../config/config.js'),
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
            if(league.requestShedule){
                var agenda = new Agenda({db: {address: config.dbagenda}})
                console.log("execute schedulematches sending ID: "+ league);
                agenda.define(league._id+' schedule', League.scheduleMatches);
                var job = agenda.create(league._id+' schedule',league.id);
                if(league.requestShedule == 'weeklyAll'){
                    job.repeatAt('in 1 weeks');
                }
                if(league.requestShedule == 'biweeklyAll'){
                    job.repeatAt('in 2 weeks');
                }
                if(league.requestShedule == 'biweeklyTwoTop'){
                    job.repeatAt('in 2 weeks');
                }
                if(league.requestShedule == 'weeklyTwoTop'){
                    job.repeatAt('in 1 weeks');
                }

                //agenda.every('10 minutes', league._id+' schedule', league.id);

                job.save()
                agenda.start();
            }
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
exports.listMyLeagueRequests = function (req, res) {
        var user = req.user;
        User.findById(user._id).populate('leaguerequests').exec(function(err, user) {
            var leagues = user.leaguerequests;
            res.jsonp(leagues);
        });
}

/**
 * Join League
 */
exports.join = function (req, res) {
    console.log("WTF");

    var league = req.league;
    var user = req.user;
    console.log(user);
    var leaguereq= user.leaguerequests.indexOf(league._id);
    if(leaguereq>-1){
        user.leaguerequests.splice(leaguereq, 1);
        user.save();
    }

    var userToPoints = new UserToPoints();
    userToPoints.user = req.user;
    userToPoints.save();

    league.users.push(userToPoints);
    user.leagues.push(league);

    console.log(league);
    league.save(function (err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            user.save(function (err) {
                if (err) {
                    console.log(err);
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(league);
                }
                ;

            });
        }
    });
};

/**
 * Join League
 */
exports.leave = function (req, res) {
    var league = req.league;
    var user = req.user;
    var i = league.users.indexOf(req.user);
    league.users.splice(i, 1);
    var j = user.leagues.indexOf(req.league);
    user.leagues.splice(j, 1);
    league.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            user.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(league);
                }
            });
        }
    });
};
exports.decline = function (req, res) {
    var league = req.league;
    var user = req.user;
    var leaguereq= user.leaguerequests.indexOf(league._id);
    user.leaguerequests.splice(leaguereq, 1);
    user.save();

};
exports.invite = function (req, res) {
    var username = req.body.user;
    var league = req.league;
    User.findOne({'username': username}, function (err, invitee) {
        if (invitee) {
            invitee.leaguerequests.push(league);
            invitee.hookEnabled = false;
            invitee.save(function(err) {
                if(err){
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                else{
                    res.jsonp(league);
                }
            })
        }
        else{
            return res.status(400).send({
                message: 'User not find'
            });
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
