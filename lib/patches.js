/* --------------------
 * sequelize-definer module
 * Patched versions of sequelize methods
 * which unify interface across Sequlize versions
 * ------------------*/

'use strict';

// Modules
const semverSelect = require('semver-select');

const sequelizeVersionImported = require('sequelize/package.json').version;

// Exports

// function to define patches
module.exports = function(Sequelize) {
	// Get Sequelize version
	const sequelizeVersion = Sequelize.version || sequelizeVersionImported;

	// Define patches
	return semverSelect.object(sequelizeVersion, {
		setReferences: {
			'<3.0.1': function(params, references) {
				params.references = references.model;
				params.referencesKey = references.key;
			},
			'*': function(params, references) {
				params.references = references;
			}
		},

		underscoredIf: {
			'<3.5.0': Sequelize.Utils._ && Sequelize.Utils._.underscoredIf,
			'*': Sequelize.Utils.underscoredIf
		}
	});
};
