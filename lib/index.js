// --------------------
// Sequelize definer
// --------------------

'use strict';

// modules
const _ = require('lodash');

// imports
const errors = require('./errors'),
	defineAll = require('./defineAll'),
	defineFromFolder = require('./defineFromFolder');

// exports
module.exports = function(Sequelize) {
	if (!Sequelize) Sequelize = require('sequelize'); // eslint-disable-line global-require

	// add custom errors to Sequelize
	errors.init(Sequelize);

	// add methods to sequelize
	_.extend(Sequelize.prototype, {
		defineAll,
		defineFromFolder
	});

	// return Sequelize
	return Sequelize;
};
