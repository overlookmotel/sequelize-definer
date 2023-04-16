/* --------------------
 * sequelize-definer module
 * Tests options
 * ------------------*/

'use strict';

// Modules
const path = require('path');

// Exports

module.exports = {
	configFile: path.resolve('config', 'database.json'),
	migrationsPath: path.resolve('db', 'migrate')
};
