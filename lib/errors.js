// --------------------
// Sequelize definer
// Errors
// --------------------

'use strict';

// modules
const _ = require('lodash'),
	util = require('util');

// exports
module.exports = {
	init(Sequelize) {
		// define errors
		const errors = {};

		// general error for all definer errors
		errors.DefinerError = function(message) {
			Sequelize.Error.call(this, message);
			this.name = 'SequelizeDefinerError';
		};
		util.inherits(errors.DefinerError, Sequelize.Error);

		// alias for error for backward-compatibility
		errors.SequelizeDefinerError = errors.DefinerError;

		// add errors to Sequelize and sequelize
		_.extend(Sequelize, errors);
		_.extend(Sequelize.prototype, errors);
	}
};
