'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * League Schema
 */
var LeagueSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill League name',
		trim: true
	},
	sport: {
		type: String,
		default: '',
		required: 'Please fill out the sport type'
	},
    ort: {
        type: String,
        default: 'Schweiz',
        required: 'Please fill out the Area where your leage is built'
    },
    lat: {
        type: Number
    },
    lng: {
        type: Number
    },
    description: {
        type: String,
        default: 'Neue Liga'
    },
    niveau: {
        type: Number,
        default: '3',
        required: 'Please fill out what skill level is required'
    },
    gender: {
        type: String,
        default: 'mixed',
        required: 'Please fill out what gender are allowed to participate'
    },
    price: {
        type: String,
        default: 'none'
    },
    startdate: {
        type: Date,
        default: Date.now
    },
    enddate: {
        type: Date,
        default: Date.now
         },
    rules: {
        type: String,
        default: "Ein Match alle zwei Wochen, autogeneriert, win 3 Punkte, unentschieden 1 Punkt, verlieren: 0 Punkte"
    },
    requestShedule: {
        type: String,
        enum: [ 'biweeklyAll', 'weeklyAll', 'biweeklyTwoTop', 'weeklyTwoTop' ]
    },
    
	created: {
		type: Date,
		default: Date.now
	},
	users: [
		{
		type: Schema.ObjectId,
		ref: 'UserToPoints'
	}],
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    matches: [
        {
            type: Schema.ObjectId,
            ref: 'Match'
        }
    ],
    private: {
        type: Boolean,
        default: false
    }

});

LeagueSchema.statics.scheduleMatches = function(job){
    var League = mongoose.model('League'),
        UserToPoints = mongoose.model('UserToPoints'),
        Matches = mongoose.model('Match');
    var leagueid = job.attrs.data;
    League.findById(leagueid).populate("users").exec(function(err, league) {
        UserToPoints.populate(league.users, {path: 'user', select: 'username'}, function (err, user) {

            if (league) {
                var l = league.users.length;
                var player1, player2;
                var k = league.users.length;
                while (true){
                if(league.requestShedule == 'biweeklyTwoTop' || league.requestShedule == 'weeklyTwoTop' ) {

                        if (league.users.length > 1) {
                             player1 = league.users[0].user;
                            player2 = league.users[1].user;
                            leage.users.splice(0,2);
                        }
                        else {
                            break;
                        }

                }else {

                        if (league.users.length > 1) {
                            var p1 = Math.floor(Math.random() * l);
                             player1 = league.users[p1].user;
                            league.users.splice(p1, 1);
                            l--;
                            var p2 = Math.floor(Math.random() * l);
                             player2 = league.users[p2].user;
                            league.users.splice(p2, 1);
                            l--;

                        }
                        else {
                            break;
                        }

                    }
                    var match = new Matches();
                    match.spieler.push({user: player1});
                    match.spieler.push({user: player2});
                    match.sport = league.sport;
                    match.league = league;
                    match.state = 'new';
                    match.save(function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    if (l == 0) {
                        break;
                    }
                }

            } else {
                console.log("no league with ID " + leagid + " found");
            }
        });
    }
    );

}

mongoose.model('League', LeagueSchema);
