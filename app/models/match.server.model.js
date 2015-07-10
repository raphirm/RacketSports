'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Match Schema
 */
var MatchSchema = new Schema({

	spieler: [{
		user: {
			type: Schema.ObjectId,
			ref: 'User'
		},
		outcome: {
			type: String,
			enum: ['win', 'draw', 'loss']
		},
		sets: [{
			outcome: {
				type: String,
				enum: ['win', 'draw', 'loss']
			},
			value: {
				type: Number
			}

		}]
	}],
	state: {
		type: String,
		enum: ['reshedule', 'new', 'proposed', 'open', 'progress', 'r2c', 'done']
	},
	propBy: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	propMsg: {
		type: String
	},
	r2cBy: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	r2cMsg: {
		type: String
	},
	court: {
		type: Schema.ObjectId,
		ref: 'Court'
	},
	sport: {
		type: String,
		enum: ['Squash', 'Tennis', 'Badminton', 'Tabletennis']
	},
	time: {
		type: Date
	},
	proposedTimes: [{
		time: {
			type: Date,
			required: true
		},
		state: {
			type: String,
			enum: ['proposed', 'agreed']
		}
	}],
	schedule: {
		type: String,
		enum: ['daily','weekly', 'monthly']
	}

});

mongoose.model('Match', MatchSchema);
