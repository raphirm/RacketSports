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
    ]

});


mongoose.model('League', LeagueSchema);
