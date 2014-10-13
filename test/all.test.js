// --------------------
// Sequelize definer
// Tests
// --------------------

// modules
var chai = require('chai'),
	expect = chai.expect,
	promised = require('chai-as-promised'),
	Sequelize = require('sequelize'),
	Support = require(__dirname + '/support'),
	Promise = Sequelize.Promise;

require('../lib/')(Sequelize);

// init

chai.use(promised);
chai.config.includeStack = true;

// tests

describe(Support.getTestDialectTeaser("Tests"), function () {
	describe('???', function() {
	});
});
