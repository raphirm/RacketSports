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
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Court', CourtSchema);