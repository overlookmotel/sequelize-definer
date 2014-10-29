# sequelize-definer.js

# Sequelize plugin to help easily define a set of models

## What's it for?

This plugin for [Sequelize](http://sequelizejs.com/) provides two utility functions to make it easier to define a set of models at once, either from a Javascript object or a folder.

## Current status

[![Build Status](https://secure.travis-ci.org/overlookmotel/sequelize-definer.png)](http://travis-ci.org/overlookmotel/sequelize-definer)
[![Dependency Status](https://david-dm.org/overlookmotel/sequelize-definer.png)](https://david-dm.org/overlookmotel/sequelize-definer)

API is stable. All features and options are fairly well tested. Works with all dialects of SQL supported by Sequelize (MySQL, Postgres, SQLite).

Designed to be used with Sequelize v2.0.0 branch, but may work on Sequelize v1.7 too - please let me know if you have success with v1.7.

Requires recent master of Sequelize v2.x dev branch, more recent than 28 Oct 2014. This is more recent than v2.0.0-rc2 which is latest available on NPM. i.e. you need to get latest Sequelize from Github.

## Usage

### Loading module

To load module:

	var Sequelize = require('sequelize-definer')();
	// NB Sequelize must also be present in `node_modules`

or, a more verbose form useful if chaining multiple Sequelize plugins:

	var Sequelize = require('sequelize');
	require('sequelize-definer')(Sequelize);

### Defining from object
#### Sequelize#defineAll( definitions [, options] )

Call `Sequelize#defineAll( definitions )`, passing an object containing the model definitions with the model names as keys.e.g.:

	sequelize.defineAll({
		User: {
			fields: {
				field1: ...,
				field2: ...
			},
			options: { ... }
		},
		Task: {
			fields: {
				field1: ...,
				field2: ...
			},
			options: { ... }
		}
	});

`fields` and `options` are the same as are passed to `Sequelize#define( modelName, fields, options )`. Both are optional.

### Defining from folder
#### Sequelize#defineFromFolder( folderPath [, options] )

Call `Sequelize#defineFromFolder( folderPath )` passing full directory path of the folder to load model definitions from. e.g.:

	sequelize.defineFromFolder( path.join( __dirname, 'models' ) );

Example of a model file:

	// User.js
	var Sequelize = require('sequelize');
	
	module.exports = {
		fields: {
			name: Sequelize.STRING
		}
	};

`defineFromFolder()` uses [require-folder-tree](https://github.com/overlookmotel/require-folder-tree/) to load the files from the folder. You can pass options to `require-folder-tree` for how the files are loaded by including an object `loadOptions` in `options` passed to `defineFromFolder()`. e.g.:

	// Load files in sub-folders as models with name prefixed by folder name
	// e.g. `User/Permission.js` defines model `UserPermission`
	sequelize.defineFromFolder( path.join( __dirname, 'models' ), {
		loadOptions: {
			// NB flatten is always set to `true`
			flattenPrefix: true
		}
	} );

### Defining one-to-one or one-to-many associations

You can create associations between models within the model definitions.

A one-to-many association:

	// Each Task belongs to a User and a User has many Tasks
	sequelize.defineAll({
		User: {
			fields: {
				name: Sequelize.STRING
			}
		},
		Task: {
			fields: {
				name: Sequelize.STRING,
				UserId: {
					reference: 'User'
				}
			}
		}
	});

	// Equivalent to:
	// Task.belongsTo(User);
	// User.hasMany(Task);

For a one-to-one association (i.e. hasOne rather than hasMany), define `referenceType: 'one'`:

	sequelize.defineAll({
		User: ...,
		Task: { fields: {
			name: ...,
			UserId: {
				reference: 'User',
				referenceType: 'one'
			}
		} }
	});
	
	// Equivalent to:
	// Task.belongsTo(User);
	// User.hasOne(Task);

NB The type of a field with `reference` is automatically inherited from the primary key of the referenced model, so no need to specify `type`.

Other options...

	sequelize.defineAll({
		User: ...,
		Task: { fields: {
			name: ...,
			UserId: {
				reference: 'User',
				referenceKey: 'id', // defaults to the primary key of the referenced model
				as: 'Owner', // defaults to name of the referenced model
				asReverse: 'TasksToDo', // defaults to name of this model
				type: Sequelize.INTEGER, // defaults to type of the primary key field in referenced model
				onDelete: 'CASCADE', // defaults to undefined (default Sequelize behaviour)
				onUpdate: 'CASCADE' // defaults to undefined (default Sequelize behaviour)
			}
		} }
	});
	
	// Equivalent to:
	// Task.belongsTo(User, { as: 'Owner', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
	// User.hasMany(Task, { as: 'TasksToDo', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
	
	// Then you can do:
	// user.getTasksToDo()
	// task.getOwner()

See `autoAssociate` option below for an even easier way to handle associations.

### Defining many-to-many associations

	sequelize.defineAll({
		User: {
			fields: {
				name: Sequelize.STRING
			}
		},
		Task: {
			fields: {
				name: Sequelize.STRING
			},
			manyToMany: {
				User: true
			}
		}
	});

	// Equivalent to:
	// Task.hasMany(User);
	// User.hasMany(Task);

Options can also be passed:

	sequelize.defineAll({
		User: ...,
		Task: {
			fields: ...,
			manyToMany: {
				User: {
					onDelete: 'RESTRICT', // defaults to undefined
					onUpdate: 'RESTRICT', // defaults to undefined
					as: 'Worker', // defaults to name of the referenced model
					asReverse: 'TasksToDo', // defaults to name of this model
					through: 'UserTask', // defaults to undefined, creating through table automatically
					skipFields: true // defaults to value of options.skipFieldsOnThrough (see below)
				}
			}
		},
		UserTask: {
			fields: {
				status: Sequelize.STRING
			}
		}
	});
	
	// Equivalent to:
	// Task.hasMany(User, { through: 'UserTask', onDelete: 'RESTRICT', onUpdate: 'RESTRICT', as: 'Worker' });
	// User.hasMany(Task, { through: 'UserTask', onDelete: 'RESTRICT', onUpdate: 'RESTRICT', as: 'TasksToDo' });

### Options

All options below apply to both `defineAll()` and `defineFromFolder()`.

Options can also be applied on a model-by-model basis in each model's options, except where noted below. Options set on a particular model override the global options.

#### primaryKey

Sets the name of the primary key attribute automatically created on all models which have no primary key defined.
Defaults to `'id'` (default Sequelize behaviour).

	sequelize.defineAll( definitions, { primaryKey: 'ID' });

If a function is provided in place of a string, the function is called to get the key name. Function is called with arguments `( modelName, definition, definitions )`.

	// primary key for model User will be UserId
	sequelize.defineAll( definitions, {
		primaryKey: function(modelName) {
			return modelName + 'Id';
		}
	});

#### primaryKeyType

Sets the type of the auto-created primary key attribute.
Defaults to `Sequelize.INTEGER` (default Sequelize behaviour).

	sequelize.defineAll( definitions, { primaryKeyType: Sequelize.INTEGER.UNSIGNED });

#### primaryKeyFirst

When `true`, creates the primary key as the first column in the table.
Defaults to `false`.

#### associateThrough

When `true`, associates through tables with their joined models.
Defaults to `false`.

This allows you to do e.g. `TaskUser.findAll( { include: [ Task, User ] } )`

`associateThrough` option can also be overridden on an individual many-to-many join with the `manyToMany` object's `associate` option.

#### autoAssociate

When `true`, automatically creates associations where a column name matches the model name + primary key of another model. No need to specify `reference` as in the association examples above. If you have a standardized naming convention, this makes it really easy and natural to define associations. Defaults to `false`.

	sequelize.defineAll({
		User: {
			fields: {
				name: Sequelize.STRING
			}
		},
		Task: {
			fields: {
				name: Sequelize.STRING,
				UserId: { allowNull: false }
			}
		}
	}, {
		// options
		autoAssociate: true
	});
	
	// This automatically runs
	// Task.belongsTo(User);
	// User.hasMany(Task);

To prevent a particular field being auto-associated, set `reference` on the field to `null`.

#### fields

Adds the fields provided to every model defined.
Defaults to `undefined`.

	sequelize.defineAll( definitions, { fields: {
		createdByUserId: {
			type: Sequelize.INTEGER,
			references: 'Users'
		}
	} });

If a function is provided in place of an object, the function is called to get the field definition. Function is called with arguments `( modelName, definition, definitions )`.

	sequelize.defineAll( definitions, {
		autoAssociate: true,
		fields: {
			createdByUserId: function(modelName) {
				return {
					reference: 'User',
					asReverse: 'created' + Sequelize.Utils.pluralize(modelName)
				};
			}
		}
	});
	
	// Equivalent to e.g.
	// Task.belongsTo(User, { as: 'createdByUser' });
	// User.hasMany(Task, { as: 'createdTasks' });

To skip adding all extra fields on a particular model, set `skipFields` to `true` in that model's options.
To skip adding a particular extra field, include that field in the model's `fields` object as `null`.

#### skipFieldsOnThrough

When `true`, does not add extra fields defined with `options.fields` to through tables.
Defaults to `false`.

To skip adding extra fields on a particular many-to-many association's through table, set `skipFields` in the `manyToMany` object's options.

#### labels

When `true`, creates a `label` attribute on each field, with a human-readable version of the field name.
Defaults to global define option set in `new Sequelize()` or `false`.

#### freezeTableName

When `true`, table names are the same as model names provided, not pluralized as per default Sequelize behaviour.
Defaults to global define option set in `new Sequelize()` or `false`.

#### camelThrough

When `true`, creates through model names in camelcase (i.e. 'taskUser' rather than 'taskuser').
Defaults to global define option set in `new Sequelize()` or `false` (default Sequelize behaviour).

`camelThrough` option can also be overridden on an individual many-to-many join with the `manyToMany` object's `camel` option.

## Tests

Use `npm test` to run the tests.
Requires a database called 'sequelize_test' and a db user 'sequelize_test' with no password.

## Changelog

See changelog.md

## Issues

If you discover a bug, please raise an issue on Github. https://github.com/overlookmotel/sequelize-definer/issues
