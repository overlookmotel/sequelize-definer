// --------------------
// Sequelize definer
// Patched versions of sequelize methods which unify interface across Sequlize versions 2.x.x and 3.x.x
// --------------------

// modules
var semverSelect = require('semver-select');

var sequelizeVersionImported = require('sequelize/package.json').version;

// exports

// function to define patches
module.exports = function(Sequelize) {
    // get Sequelize version
    var sequelizeVersion = Sequelize.version || sequelizeVersionImported;

    // define patches
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
            '<3.5.0': Sequelize.Utils._.underscoredIf,
            '*': Sequelize.Utils.underscoredIf
        }
    });
};
