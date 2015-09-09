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
    },

    underscoredIf: {
        '<3.5.0': function(string, condition, Sequelize) {
            return Sequelize.Utils._.underscoredIf(string, condition);
        },
        '*': function(string, condition, Sequelize) {
            return Sequelize.Utils.underscoredIf(string, condition);
        }
    }
});
