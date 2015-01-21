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
	created: {
		type: Date,
		default: Date.now
	},
	users: [
		{
		type: Schema.ObjectId,
		ref: 'UserToPoints'
	}]

});


mongoose.model('League', LeagueSchema);
