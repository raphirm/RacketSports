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
		enum: ['new', 'sent', 'open', 'progress', 'done']
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
		type: String

	}

});

mongoose.model('Match', MatchSchema);
