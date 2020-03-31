/* --------------------
 * Sequelize definer
 * Sequelize#defineFromFolder() method
 * ------------------*/

'use strict';

// modules
const _ = require('lodash'),
	requireFolderTree = require('require-folder-tree');

// imports
const utils = require('./utils');

// exports

// define a set of models at once from a folder
// input expected:
//   path: string of full path of folder
//   options: options object
module.exports = function(path, options) {
	options = _.clone(options || {});

	const loadOptions = _.clone(utils.pop(options, 'loadOptions') || {});
	loadOptions.flatten = true;

	const definitions = requireFolderTree(path, loadOptions);

	return this.defineAll(definitions, options);
};
