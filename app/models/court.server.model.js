'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Court Schema
 */
var CourtSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Court name',
		trim: true
	},
	address: {
		type: String,
		required: 'Please fill in a address the court is located'
	},
	lat: {
		type: String,
		required: "Please fill in a correct address (select it from the dropdown)"
	},
	lng: {
		type: String,

		required: "Please fill in a correct address (select it from the dropdown)"
	},
	sports: {
		type: [{
			type: String,
			enum: ['Squash', 'Tennis', 'Badminton', 'Tabletennis']
		}],
		required: 'please select at least one sport that you can play in that sportcenter'
	},
	contact: {
		type: String
	},

	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	players: [
		{
			type: Schema.ObjectId,
			ref: 'User'
		}
		]



});

mongoose.model('Court', CourtSchema);
