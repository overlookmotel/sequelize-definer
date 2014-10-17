// --------------------
// Sequelize definer
// Tests
// --------------------

// modules
var chai = require('chai'),
	expect = chai.expect,
	promised = require('chai-as-promised'),
	Support = require(__dirname + '/support'),
	Sequelize = Support.Sequelize,
	Promise = Sequelize.Promise,
	Utils = Sequelize.Utils,
	_ = Utils._;

// init

chai.use(promised);
chai.config.includeStack = true;

// tests

describe(Support.getTestDialectTeaser("Tests"), function () {
	describe('defineAll', function() {
		it('defines all models', function() {
			var definitions = {
				User: {
					fields: {
						name: {type: Sequelize.STRING(50)}
					}
				},
				Task: {
					fields: {
						name: {type: Sequelize.STRING(50)}
					}
				}
			};
			
			this.sequelize.defineAll(definitions);
			
			_.forIn(definitions, function(definition, modelName) {
				expect(this.sequelize.models[modelName]).to.be.ok;
			}.bind(this));
		});
	});
});
