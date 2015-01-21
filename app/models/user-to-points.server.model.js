'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * UserToPoints Schema
 */
var UserToPointsSchema = new Schema({
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	points: {
		type: Number,
		default: "0"
	},
	wins: {
		type: Number,
		default: "0"
	},
	draws: {
		type: Number,
		default: "0"
	},
	loss: {
		type: Number,
		default: "0"
	}
});

mongoose.model('UserToPoints', UserToPointsSchema);
