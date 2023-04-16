/* --------------------
 * sequelize-definer module
 * Entry point
 * ------------------*/

'use strict';

// Imports
const errors = require('./errors.js'),
	defineAll = require('./defineAll.js'),
	defineFromFolder = require('./defineFromFolder.js');

// Exports
module.exports = function(Sequelize) {
	if (!Sequelize) Sequelize = require('sequelize'); // eslint-disable-line global-require

	// Add custom errors to Sequelize
	errors.init(Sequelize);

	// Add methods to sequelize
	Object.assign(Sequelize.prototype, {
		defineAll,
		defineFromFolder
	});

	// Return Sequelize
	return Sequelize;
};
