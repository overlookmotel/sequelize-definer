// --------------------
// errors
// --------------------

// modules
var _ = require('lodash'),
	util = require('util');

// exports
module.exports = {
	init: function(Sequelize) {
		// define errors
		var errors = {};
		
		errors.SequelizeDefinerError = function(message) {
			Sequelize.Error.call(this, message);
			this.name = 'SequelizeDefinerError';
		};
		util.inherits(errors.SequelizeDefinerError, Sequelize.Error);
		
		// add errors to Sequelize
		_.extend(Sequelize, errors);
		_.extend(Sequelize.prototype, errors);
	}
};
