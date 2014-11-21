// --------------------
// Sequelize definer
// --------------------

// modules
var _ = require('lodash');

// imports
var errors = require('./errors'),
	defineAll = require('./defineAll'),
	defineFromFolder = require('./defineFromFolder');

// exports
module.exports = function(Sequelize) {
	if (!Sequelize) Sequelize = require('sequelize');
	
	// add custom errors to Sequelize
	errors.init(Sequelize);
	
	// add methods to sequelize
	_.extend(Sequelize.prototype, {
		defineAll: defineAll,
		defineFromFolder: defineFromFolder
	});
	
	// return Sequelize
	return Sequelize;
};
