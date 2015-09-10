// --------------------
// Sequelize definer
// Errors
// --------------------

// modules
var _ = require('lodash'),
	util = require('util');

// exports
module.exports = {
	init: function(Sequelize) {
		// define errors
		var errors = {};

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
