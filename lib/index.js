// --------------------
// Sequelize definer
// --------------------

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
	Sequelize.prototype.defineAll = defineAll;
	Sequelize.prototype.defineFromFolder = defineFromFolder;
	
	// return Sequelize
	return Sequelize;
};
