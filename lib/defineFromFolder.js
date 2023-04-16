/* --------------------
 * Sequelize definer
 * Sequelize#defineFromFolder() method
 * ------------------*/

'use strict';

// Modules
const _ = require('lodash'),
	requireFolderTree = require('require-folder-tree');

// Imports
const utils = require('./utils.js');

// Exports

/**
 * Define a set of models at once from a folder.
 * Called as `sequelize.defineFromFolder()`.
 * @param {string} path - Path to folder containing model definitions
 * @param {Object} [options] - Options object
 * @returns {Object} - Sequelize instance
 */
module.exports = function(path, options) {
	options = _.clone(options || {});

	const loadOptions = _.clone(utils.pop(options, 'loadOptions') || {});
	loadOptions.flatten = true;

	const definitions = requireFolderTree(path, loadOptions);

	return this.defineAll(definitions, options);
};
