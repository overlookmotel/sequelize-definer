// --------------------
// Sequelize definer
// Patched versions of sequelize methods which unify interface across Sequlize versions 2.x.x and 3.x.x
// --------------------

// modules
var semverSelect = require('semver-select');

var sequelizeVersion = require('sequelize/package.json').version;

// exports

// define patches
module.exports = semverSelect.object(sequelizeVersion, {
    setReferences: {
        '<3.0.1': function(params, references) {
            params.references = references.model;
            params.referencesKey = references.key;
        },
        '*': function(params, references) {
            params.references = references;
        }
    }
});
