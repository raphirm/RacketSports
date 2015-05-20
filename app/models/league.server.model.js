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
    description: {
        type: String,
        default: 'Neue Liga'
    },
    niveau: {
        type: String,
        default: 'Voll Schlecht',
        required: 'Please fill out what skill level is required'
    },
    gernder: {
        type: String,
        default: 'mixed',
        required: 'Please fill out what gender are allowed to participate'
    },
    mode: {
        type: String,
        default: 'single',
        required: 'Please fill out what mode'
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
    }

});


mongoose.model('League', LeagueSchema);
