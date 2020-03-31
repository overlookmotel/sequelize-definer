/* --------------------
 * Sequelize definer
 * Entry point
 * ------------------*/

'use strict';

// Modules
const _ = require('lodash');

// Imports
const errors = require('./errors'),
	defineAll = require('./defineAll'),
	defineFromFolder = require('./defineFromFolder');

// Exports
module.exports = function(Sequelize) {
	if (!Sequelize) Sequelize = require('sequelize'); // eslint-disable-line global-require

	// Add custom errors to Sequelize
	errors.init(Sequelize);

	// Add methods to sequelize
	_.extend(Sequelize.prototype, {
		defineAll,
		defineFromFolder
	});

	// Return Sequelize
	return Sequelize;
};
