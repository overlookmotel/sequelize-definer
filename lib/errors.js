/* --------------------
 * sequelize-definer module
 * Errors
 * ------------------*/

'use strict';

// Modules
const _ = require('lodash'),
	util = require('util');

// Exports
module.exports = {
	init(Sequelize) {
		// Define errors
		const errors = {};

		// General error for all definer errors
		errors.DefinerError = function(message) {
			Sequelize.Error.call(this, message);
			this.name = 'SequelizeDefinerError';
		};
		util.inherits(errors.DefinerError, Sequelize.Error);

		// Alias for error for backward-compatibility
		errors.SequelizeDefinerError = errors.DefinerError;

		// Add errors to Sequelize and sequelize
		_.extend(Sequelize, errors);
		_.extend(Sequelize.prototype, errors);
	}
};
