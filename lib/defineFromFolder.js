// --------------------
// Sequelize definer
// Sequelize#defineFromFolder() method
// --------------------

// modules
var _ = require('lodash'),
	requireFolderTree = require('require-folder-tree');

// imports
var utils = require('./utils');

// exports

// define a set of models at once from a folder
// input expected:
//   path: string of full path of folder
//   options: options object
module.exports = function(path, options) {
	options = _.clone(options || {});

	var loadOptions = _.clone(utils.pop(options, 'loadOptions') || {});
	loadOptions.flatten = true;

	var definitions = requireFolderTree(path, loadOptions);

	if (loadOptions.capitalize) {
		Object.keys(definitions).map(function(modelName) {
			definitions[utils.capitalize(modelName)] = definitions[modelName];
			delete definitions[modelName];
		});
	}

	return this.defineAll(definitions, options);
};
