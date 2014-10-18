# sequelize-definer.js

# Sequelize plugin to help easily define a set of models

## What's it for?

This plugin for [Sequelize](http://sequelizejs.com/) provides two utility functions to make it easier to define a set of models at once, either from a Javascript object or a folder.

## Current status

API is stable.

All features listed below are implemented but it's not tested so not quite ready for use yet. Tests to follow shortly.

Designed to be used with Sequelize v2.0.0 branch, but may work mostly on Sequelize v1.7 too.

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

	// Load files in sub-folders as models with name prefixed by folder name in camelcase
	// e.g. `user/permission.js` defines model `userPermission`
	sequelize.defineFromFolder( path.join( __dirname, 'models' ), {
		loadOptions: {
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
					through: 'UserTask' // defaults to undefined, creating through table automatically
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

#### labels

When `true`, creates a `label` attribute on each field, with a human-readable version of the field name.
Defaults to `false`.

#### freezeTableName

When `true`, table names are the same as model names provided, not pluralized as per default Sequelize behaviour.
Can also be defined per model by setting the option in the individual model definition.
Defaults to global define option set in `new Sequelize()`.

#### camelThrough

When `true`, creates through model names in camelcase (i.e. 'taskUser' rather than 'taskuser').
Defaults to `false` (default Sequelize behaviour).

## Tests

Use `npm test` to run the tests.
Requires a database called 'sequelize_test' and a db user 'sequelize_test', password 'sequelize_test'.

Test coverage is very minimal at present.

## Changelog

See changelog.md

## TODO

* Write tests
* Make autoAssociate handle underscored style as well as camelcase

## Issues

If you discover a bug, please raise an issue on Github. https://github.com/overlookmotel/sequelize-definer/issues
