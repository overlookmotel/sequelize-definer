// --------------------
// errors
// --------------------

// modules
var util = require('util');

// exports
module.exports = function(Sequelize) {
	var errors = {};
	
	errors.SequelizeDefinerError = function(message) {
		Sequelize.Error.call(this, message);
		this.name = 'SequelizeDefinerError';
	};
	util.inherits(errors.SequelizeDefinerError, Sequelize.Error);
	
	return errors;
};
